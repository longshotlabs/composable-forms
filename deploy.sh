#!/bin/bash

echo "Rebuilding..."
mkdocs build --clean
echo "Deploying to S3..."
aws s3 cp $PWD/site s3://forms.dairystatedesigns.com/ --recursive --acl public-read
echo "Done!"