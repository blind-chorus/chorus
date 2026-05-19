// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "ChorusUI",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [
        .library(name: "ChorusUI", targets: ["ChorusUI"]),
        .library(name: "ChorusUICatalog", targets: ["ChorusUICatalog"]),
    ],
    dependencies: [
        .package(name: "ChorusTokens", path: "../tokens-ios"),
    ],
    targets: [
        .target(
            name: "ChorusUI",
            dependencies: [.product(name: "ChorusTokens", package: "ChorusTokens")],
            path: "Sources/ChorusUI"
        ),
        .target(
            name: "ChorusUICatalog",
            dependencies: ["ChorusUI"],
            path: "Sources/ChorusUICatalog"
        ),
    ]
)
