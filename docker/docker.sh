function deploy_dev () {
	command echo "Building dev docker: " 
	if ! command docker build -t mask_dev_image -f ./docker/Dockerfile-dev .
	then
		exit 1
	fi
	command docker container kill mask_dev
	command docker container rm mask_dev
	command docker run --name mask_dev --restart always -d -p 6971:6969 mask_dev_image &&
	command docker update --restart always mask_dev
	command echo "Dev docker is running!"
}

function deploy_prod () {
if ! command docker build -t mask_image -f ./docker/Dockerfile .
	then
		exit 1
	fi
	command docker container kill mask
	command docker container rm mask
	command docker run --name mask --restart always -d -p 6969:6969 mask_image &&
	command docker update --restart always mask
	command echo "Prod docker is running!"
}

if [ "$1" == "all" ] ; then 
	deploy_dev
	deploy_prod
elif [ "$1" == "dev" ] ; then
	deploy_dev
elif [ "$1" == "prod" ] ; then
	deploy_prod
else
	command echo "No environment specified."
fi
