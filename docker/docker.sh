if [ "$1" == "dev" ] ; then
	command docker build -t mask-dev --project-directory . -f ./docker/Dockerfile-dev
	command docker run --name mask_dev -rm -p 6971:6969 mask-dev
	command echo "Dev docker is running!"
elif [ "$1" == "prod" ] ; then
	command docker build -t mask --project-directory . -f ./docker/Dockerfile
	command docker run --name mask -rm -p 6971:6969 mask
	command echo "Dev docker is running!"
fi
