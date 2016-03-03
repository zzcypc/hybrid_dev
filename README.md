# hybrid_dev


>旧物继承是一款大学生的二手交易平台，只对NEUQ学生服务，数据库只支持NEUQ学号登陆。跟几个同学在大二时一起做的，时间和精力不够加之不自信，未能上线。



- ionic 1.0 架构，用到了几个cordova关于相机和文件系统的插件，图片上传是用phonegap的插件，由于resources文件太大，就没上传。



- 由于是hybrid app，担心借口暴露后信息被抓包，在接口安全上做了很多努力，处理了图片的并发问题（其实是自己造成的并发）。后端是嘉陵和粽子一起做的，做到了教务处系统的模拟登陆，给人一种我们黑了教务处数据库的感觉。


![image](https://raw.githubusercontent.com/Picknight/hybrid_dev/master/resources/show.png)

