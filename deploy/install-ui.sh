#!/bin/sh

# 0. make sure influxdb was launched with ican database

# 1. Install weave scope prob agent
kubectl apply --namespace kube-system -f "https://cloud.weave.works/k8s/scope.yaml?k8s-version=$(kubectl version | base64 | tr -d '\n')"

# 2. Install autorender-ui
kubectl apply -f autorender-ui.yaml

# 3. Install network-control-plugin
kubectl apply -f network-control-plugin.yaml


# 4. (optional) Install complete microservice demo (sock shop)
kubectl apply -f complete-demo.yaml
