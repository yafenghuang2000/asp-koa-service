#!/bin/bash

# 设置变量
IMAGE_NAME="yafenghuang2000/asp-koa-service"
TAG="latest"

# 构建 Docker 镜像
docker build -t $IMAGE_NAME:$TAG .

# 登录 Docker Hub
echo "请输入 Docker Hub 用户名："
read DOCKER_USERNAME
echo "请输入 Docker Hub 密码："
read -s DOCKER_PASSWORD
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# 推送 Docker 镜像
docker push $IMAGE_NAME:$TAG

# 登出 Docker Hub
docker logout