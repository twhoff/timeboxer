Get all the file contents:

find . -type f \( -name '_.ts' -o -name '_.tsx' -o -name '_.js' -o -name '_.jsx' -o -name '_.css' -o -name '_.html' -o -name '_.md' -o -name 'package.json' \) ! -path './node_modules/_' ! -path './dist/_' ! -name 'yarn.lock' ! -name '_.config' ! -name '.eslintrc' ! -name '.prettierrc' ! -name '.babelrc' ! -name '.gitignore' ! -name '.env' -exec cat {} + | pbcopy

Get the directory tree:
tree /Users/thoffmann/Desktop/timeboxer -I 'node_modules|.\*' | pbcopy