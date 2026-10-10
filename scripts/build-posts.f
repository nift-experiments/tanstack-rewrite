result := cmd("node", "scripts/prepare-posts.mjs").cwd(getenv("NIFT_HOOK_ROOT")).run()
if(!result.launched || result.exit_code != 0) { throw error("Post projection failed: " + result.stderr, "build.tool_failed") }
