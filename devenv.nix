{ pkgs, ... }:

{
  packages = with pkgs; [ turso-cli sqld sqlite ];

  dotenv.enable = true;
}
