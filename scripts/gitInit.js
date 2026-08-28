import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();

async function initRepo() {
  console.log('Initializing repository in:', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });

  // Get all files recursively excluding node_modules, dist, .git
  function getFiles(currentDir) {
    let results = [];
    const list = fs.readdirSync(currentDir);
    for (const file of list) {
      const fullPath = path.join(currentDir, file);
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');

      if (
        relPath.startsWith('node_modules') ||
        relPath.startsWith('dist') ||
        relPath.startsWith('.git') ||
        relPath.startsWith('.tmp')
      ) {
        continue;
      }

      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else {
        results.push(relPath);
      }
    }
    return results;
  }

  const files = getFiles(dir);
  console.log(`Staging ${files.length} files...`);

  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Committing changes to main branch...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'EventBudget AI Assistant',
      email: 'eventbudget@antigravity.dev',
    },
    message: 'Initial commit: Complete EVENTBUDGET smart event budgeting platform MVP',
  });

  console.log('Committed successfully with SHA:', sha);
}

initRepo().catch(console.error);
