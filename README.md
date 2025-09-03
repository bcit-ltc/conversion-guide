# Course Production Conversion Guide

Welcome to the Conversion Guide for BCIT Course Production!

## In this guide

The Course Production Conversion Guide is an online reference for anybody that develops, produces, or maintains an online course at BCIT.  It provides up-to-date information regarding all of the default tools packaged into the LTC approved course framework.  This includes:

1. Word markers - How to prepare your MS Word document when developing your content
1. HTML - How to use a feature in HTML format
1. Notes - Notes about various features


## Development

**Requirements**: Docker, NodeJS

```bash
docker compose up --build
```

If you encounter an error, consider the following:

* Ensure Node.js (and npm) are installed on your computer
* Ensure you run the command from the project root (same folder as package.json)

## Deployment

This package was modified to run on Kubernetes. To build and test the image locally, run:

```bash
docker build -t conversion-guide .

docker run -p 8080:8080 conversion-guide
```

Browse to `http://localhost:8080/` to view the container.
