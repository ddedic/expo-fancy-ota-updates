import { describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { incrementVersion, readVersionData } from './version';

describe('cli/version', () => {
  it('readVersionData returns null for missing file', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ota-'));
    const filePath = path.join(tmp, 'does-not-exist.json');

    const res = await readVersionData(filePath);
    expect(res).toBeNull();
  });

  it('incrementVersion: build strategy increments build number', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ota-'));

    const config: any = {
      baseVersion: '1.2.3',
      versionStrategy: 'build',
      versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
    };

    const v1 = await incrementVersion(null, 'production', ['Init'], config, tmp);
    expect(v1.buildNumber).toBe(1);
    expect(v1.version).toBe('1.2.3-production.1');

    const v2 = await incrementVersion(v1, 'production', ['Second'], config, tmp);
    expect(v2.buildNumber).toBe(2);
    expect(v2.version).toBe('1.2.3-production.2');
  });

  it('incrementVersion: semver strategy increments patch', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ota-'));

    const config: any = {
      baseVersion: '1.2.3',
      versionStrategy: 'semver',
      versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
    };

    const v1 = await incrementVersion(null, 'preview', [], config, tmp);
    // If no current, it keeps base patch
    expect(v1.version).toBe('1.2.3-preview.1');

    const v2 = await incrementVersion(v1, 'preview', [], config, tmp);
    // With current, it increments patch
    expect(v2.version).toBe('1.2.4-preview.2');
  });

  it('incrementVersion: date strategy includes YYYYMMDD timestamp', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ota-'));

    const config: any = {
      baseVersion: '1.0.0',
      versionStrategy: 'date',
      versionFormat: '{major}.{minor}.{patch}-{channel}.{timestamp}.{build}',
    };

    const v = await incrementVersion(null, 'staging', [], config, tmp);
    expect(v.version).toMatch(/^1\.0\.0-staging\.\d{8}\.1$/);
  });
});
