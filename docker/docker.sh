if [ "$1" == "dev" ] ; then
	if ! command docker build -t mask_dev_image -f ./docker/Dockerfile-dev .
	then
		exit 1
	fi
	command docker container rm mask_dev
	command docker run --name mask_dev -dp 6971:6969 mask_dev_image &&
	echo "Dev docker is running!"
elif [ "$1" == "prod" ] ; then
	if ! command docker build -t mask_image -f ./docker/Dockerfile .
	then
		exit 1
	fi
	command docker container rm mask
	command docker run --name mask -dp 6971:6969 mask_image &&
	command echo "Dev docker is running!"
else
	command echo "No environment specified."
fi
