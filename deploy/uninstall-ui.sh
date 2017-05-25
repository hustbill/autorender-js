#!/bin/sh

# 1. Uninstall weave scope prob agent
kubectl delete --namespace kube-system -f "https://cloud.weave.works/k8s/scope.yaml?k8s-version=$(kubectl version | base64 | tr -d '\n')"

# 2. Uninstall autorender-ui
kubectl delete -f autorender-ui.yaml

# 3. Uninstall network-control-plugin
kubectl delete -f network-control-plugin.yaml

# 4. (optional) Uninstall complete microservice demo (sock shop)
kubectl delete -f complete-demo.yaml
