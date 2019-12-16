
IMAGE_NAME="myApplication"
CONTAINER_NAME="myApplicationContainer"  

npm install
npm run build

rm -rf ${IMAGE_NAME}
mkdir ${IMAGE_NAME}
cp deployment/frontEndDockerFile ./${IMAGE_NAME}/DockerFile
cp deployment/frontEndNginxConfig.conf ./${IMAGE_NAME}/nginx.conf
cp -r dist ./${IMAGE_NAME}/dist

echo "构建完成，停止并删除原镜像:"
docker stop ${CONTAINER_NAME}
docker rm ${CONTAINER_NAME}
docker rmi ${IMAGE_NAME}

echo "构建新镜像"
cd ${IMAGE_NAME}
docker build -t ${IMAGE_NAME} .

echo "发布应用"
docker run -d -p 80:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}