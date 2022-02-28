@echo off
@chcp 65001

set version=4.2.1

echo "Copying docx file"
cp "C:\Users\mmakos\Documents\Śpiewnik\Śpiewnik-%version%.docx" docx

echo Generating html files
python convert.py %version%
echo Generating sql script
python generate_sql.py

type sql\songbook.sql | clip
echo SQL script copied to clipboard