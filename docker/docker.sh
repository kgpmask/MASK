set -e

if [ "$1" == "dev" ] ; then
	command docker build -t mask-dev -f ./docker/Dockerfile-dev .
	command docker container rm mask_dev
	command docker run --name mask_dev -dp 6971:6969 mask_dev
	command echo "Dev docker is running!"
elif [ "$1" == "prod" ] ; then
	command docker build -t mask -f ./docker/Dockerfile .
	command docker container rm mask
	command docker run --name mask -dp 6971:6969 mask
	command echo "Dev docker is running!"
fi
