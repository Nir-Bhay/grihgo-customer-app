---
name: runtime-debugging
description: Systematic approach to debugging React Native/Expo runtime errors and crashes
---

# Runtime Debugging Skill

## Purpose
Rapidly identify and fix runtime errors in React Native/Expo apps during development.

---

## Error Categories

### 1. **Bundler Errors** (Metro Bundler)
- **Pattern**: `Unable to resolve "..." from "..."`
- **Cause**: Missing file/module, wrong import path
- **Fix Steps**:
  1. Check if file exists at specified path
  2. Verify exact filename (case-sensitive)
  3. Check for typos in require/import statements
  4. Clear cache: `npx expo start -c`

### 2. **Babel/Plugin Errors**
- **Pattern**: `Cannot find module '...'` during bundling
- **Cause**: Missing peer dependency or version mismatch
- **Fix Steps**:
  1. Check `package.json` for the referenced package
  2. Install missing package: `npm install <package> --legacy-peer-deps`
  3. Verify compatible version with `npx expo install <package>`

### 3. **Component Exceptions (Red Screen)**
- **Pattern**: `TypeError: undefined is not an object`
- **Cause**: Accessing property of undefined variable
- **Fix Steps**:
  1. Check error stack trace for exact line
  2. Add null checks: `data?.property`
  3. Verify data is loaded before rendering

### 4. **Navigation Errors**
- **Pattern**: `The action 'NAVIGATE' was not handled`
- **Cause**: Invalid route name or missing screen
- **Fix Steps**:
  1. Verify route exists in file-based routing (`src/app/`)
  2. Check for typos in route name
  3. Ensure proper nesting for layouts

---

## Debugging Workflow

```
1. READ ERROR MESSAGE
   ↓
2. IDENTIFY CATEGORY
   ↓
3. LOCATE SOURCE (file:line from stack)
   ↓
4. APPLY FIX
   ↓
5. RESTART SERVER (npx expo start -c)
   ↓
6. VERIFY
```

---

## Common Commands

```bash
# Clear cache and restart
npx expo start -c

# Check installed package version
npm ls <package-name>

# Install Expo-compatible version
npx expo install <package-name>

# Install with legacy peer deps (for conflicts)
npm install <package> --legacy-peer-deps

# View detailed error logs
npx expo start --dev-client
```

---

## Quick Reference Table

| Error Type | Key Indicator | Quick Fix |
|------------|---------------|-----------|
| Missing file | `Unable to resolve` | Check path exists |
| Missing package | `Cannot find module` | `npm install <pkg>` |
| Version conflict | `peer dep` issues | `--legacy-peer-deps` |
| Runtime crash | Red screen | Check undefined values |
| Build fail | Exit code 1 | Read full error log |

---

## Checklist Before Reporting Fixed

- [ ] Server started without bundler errors
- [ ] App loads on device without crash
- [ ] Navigation works between screens
- [ ] No console warnings about missing dependencies
