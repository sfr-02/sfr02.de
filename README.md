# Source Code for sfr02.de

## jekyll

```bash
sudo apt-get install -y bundler
bundler install

bundle exec jekyll serve
# or
jekyll serve
```

## git LFS

```bash
wget https://packagecloud.io/github/git-lfs/packages/debian/bullseye/git-lfs_3.2.0_amd64.deb/download -O git-lfs_3.2.0_amd64.deb
sudo apt install -y ./git-lfs_3.2.0_amd64.deb && rm ./git-lfs_3.2.0_amd64.deb
git lfs install
git lfs fetch
git lfs checkout
```
