#!/bin/bash

echo "Rebuilding..."
mkdocs build --clean
echo "Deploying to S3..."
aws s3 cp $PWD/site s3://composable-forms/ --recursive --acl public-read
echo "Done!"
