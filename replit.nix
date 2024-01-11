{ pkgs }: {
  deps = [
    pkgs.rubyPackages_3_0.sass
    pkgs.sass
    pkgs.\
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}