 cd Lambdas/src
      find . -type d | while read dir; do
        if [ -f "$dir/package.json" ]; then
          echo "Found package.json in $dir. Running npm install..."
          cd "$dir" && npm install && cd -
        else
          echo "No package.json found in $dir. Skipping npm install."
        fi
      done
cd ../extra_lambdas/node
      find . -type d | while read dir; do
        if [ -f "$dir/package.json" ]; then
          echo "Found package.json in $dir. Running npm install..."
          cd "$dir" && npm install && cd -
        else
          echo "No package.json found in $dir. Skipping npm install."
        fi
      done