result := cmd("node", "scripts/generate-corpus.mjs", "--prepare-only").cwd(getenv("NIFT_HOOK_ROOT")).run()
if(!result.launched || result.exit_code != 0) { throw error("Corpus preparation failed: " + result.stderr, "build.tool_failed") }
