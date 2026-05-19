rootProject.name = "chorus-ui-root"
include(":chorus-ui", ":chorus-ui-catalog")

// Resolve the tokens Gradle module from the sibling package directory.
includeBuild("../tokens-android")
