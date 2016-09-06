rm source.zip
cd www
zip -r --exclude=.sass-cache --exclude=*.~* --exclude=touch_zermelo/**\* --exclude=resources_zermelo/**\* ../source *
