{ pkgs, ... }:

let 
  inherit ((builtins.fromJSON (builtins.readFile "${pkgs.playwright-driver}/browsers.json"))) browsers;
  chromium-rev = (builtins.head (builtins.filter (x: x.name == "chromium") browsers)).revision;
in
{
  packages = with pkgs; [ turso-cli sqld sqlite ];

  dotenv.enable = true;

  env = {
    PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright.browsers}";
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
    PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH = "${pkgs.playwright.browsers}/chromium-${chromium-rev}/chrome-linux/chrome";

    NIX_PLAYWRIGHT_VERSION = pkgs.playwright-driver.version;
  };
}
