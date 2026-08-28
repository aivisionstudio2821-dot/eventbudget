import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.js';
import fs from 'fs';

const dir = process.cwd();

export async function pushToGitHub(repoUrl, token) {
  console.log(`Pushing to ${repoUrl}...`);
  
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: repoUrl,
    force: true,
  });

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: token,
      password: '',
    }),
  });

  console.log('Push result:', pushResult);
  return pushResult;
}

// If run from command line with arguments
if (process.argv[2] && process.argv[3]) {
  pushToGitHub(process.argv[2], process.argv[3]).catch(console.error);
}
