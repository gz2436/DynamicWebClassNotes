# Week 1 Assignment Summary

## Course Information
- Course Name: Dynamic Web (F25 Graduate)
- Week: Week 1
- Submission Date: 2025-09-16
- Student Name: Gavin Zhang

## Weekly Tasks
1. Set up the local development environment (Node.js, VS Code, etc.)
2. Initialize a Git repository and link it to a remote GitHub repository
3. Organize course-related files and standardize the directory structure
4. Learn basic Git operations (add, commit, push, etc.)
5. Configure ignore rules for `.DS_Store` and `package-lock.json` files

## Completion Status
- [x] Local development environment has been set up
- [x] Git repository has been initialized and linked to the remote repository
- [x] File directories have been organized (related files moved to designated folders)
- [x] Basic Git operation workflows have been mastered
- [x] `.gitignore` file has been configured to resolve redundant file upload issues

## Learning Insights
- Gained an initial understanding of core Git operations and the synchronization logic between local and remote repositories.
- Learned to manage files that do not need to be uploaded via `.gitignore`, making the repository structure clearer.
- Encountered an issue where Git tracking was abnormal after file path changes, and resolved it by re-running `git add` and `git commit`.

## Issues & Solutions
1. Issue: `.DS_Store` and `package-lock.json` still appeared in the remote repository after being configured in `.gitignore`.  
   Solution: Used `git rm --cached [file name]` to remove tracked files, and the issue was resolved after re-committing.

2. Issue: Git status showed confusion after moving files to a new folder.  
   Solution: Re-tracked all file changes by executing `git add .`, and committed after confirmation.

## Future Plans
- Review this week's Git operations to prepare for Week 2's assignment.
- Preview basic React syntax in advance.