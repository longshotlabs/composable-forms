# "Composable Form Specification" Documentation Site

Uses [mkdocs](http://www.mkdocs.org/)

## Editing

To view in browser and refresh when editing locally:

```bash
$ mkdocs serve
```

Then go to http://localhost:8000/

Edit only the files in /docs and mkdocs.yml and this readme. Do not edit anything in /site or it will be lost on the next build.

## Deploying

The deploy script will rebuild the /site folder and then upload to the S3 bucket (assuming you have proper AWS account access and your credentials saved in environment variables).

```bash
$ ./deploy.sh
```
