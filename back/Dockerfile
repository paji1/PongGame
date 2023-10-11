from debian:buster

run apt  update && apt install -y curl bash  procps
run curl -fsSL https://deb.nodesource.com/setup_20.x |  bash - &&  apt-get install -y nodejs

copy dockerconf/script.sh /

ENTRYPOINT ["bash", "script.sh"]
CMD ["npm", "run", "start:dev"]