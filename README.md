# "Composable Form Specification" Documentation Site

Running or building this repo locally requires [mkdocs](http://www.mkdocs.org/) 0.17.2 or higher.

## Running Locally and Making Changes

To view in browser and refresh when editing locally:

```bash
mkdocs serve
```

Then go to http://localhost:8000/

Refer to [CONTRIBUTING.md]

## Deploying

The deploy script will rebuild the /site folder and then upload to the S3 bucket (assuming you have proper AWS account access and your credentials saved in environment variables).

```bash
./deploy.sh
```
