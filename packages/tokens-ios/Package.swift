// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "ChorusTokens",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [
        .library(name: "ChorusTokens", targets: ["ChorusTokens"]),
    ],
    targets: [
        .target(name: "ChorusTokens", path: "Sources/ChorusTokens"),
    ]
)
