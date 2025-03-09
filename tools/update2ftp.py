#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import configparser
import logging
import paramiko
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("sftp_upload.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_config(config_file):
    """从配置文件加载 SFTP 配置信息"""
    if not os.path.exists(config_file):
        logger.error(f"配置文件不存在: {config_file}")
        sys.exit(1)
    
    config = configparser.ConfigParser()
    config.read(config_file)
    
    try:
        sftp_server = config['DEFAULT']['ftp.server']
        sftp_username = config['DEFAULT']['ftp.username']
        sftp_password = config['DEFAULT']['ftp.password']
        sftp_port = int(config['DEFAULT'].get('ftp.port', '22'))  # 默认SFTP端口为22
        return sftp_server, sftp_username, sftp_password, sftp_port
    except KeyError as e:
        logger.error(f"配置文件中缺少必要的配置项: {e}")
        sys.exit(1)

def upload_file_to_sftp(local_file, remote_dir, sftp_server, sftp_username, sftp_password, sftp_port=22):
    """将文件上传到 SFTP 服务器"""
    if not os.path.exists(local_file):
        logger.error(f"本地文件不存在: {local_file}")
        return False
    
    try:
        # 创建SSH客户端
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # 连接到服务器
        logger.info(f"正在连接到SFTP服务器: {sftp_server}:{sftp_port}")
        ssh.connect(sftp_server, port=sftp_port, username=sftp_username, password=sftp_password)
        
        # 创建SFTP客户端
        sftp = ssh.open_sftp()
        logger.info(f"成功连接到SFTP服务器: {sftp_server}")
        
        # 确保远程目录存在
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            # 如果目录不存在，创建它
            create_remote_directory(ssh, remote_dir)
        
        # 上传文件
        filename = os.path.basename(local_file)
        remote_path = os.path.join(remote_dir, filename)
        logger.info(f"开始上传文件: {filename}")
        sftp.put(local_file, remote_path)
        
        logger.info(f"文件上传成功: {filename}")
        sftp.close()
        ssh.close()
        return True
    
    except Exception as e:
        logger.error(f"上传文件时发生错误: {str(e)}")
        return False

def create_remote_directory(ssh, remote_dir):
    """在SFTP服务器上创建目录（支持多级目录）"""
    try:
        # 执行mkdir -p命令创建多级目录
        stdin, stdout, stderr = ssh.exec_command(f"mkdir -p {remote_dir}")
        exit_status = stdout.channel.recv_exit_status()
        if exit_status != 0:
            error = stderr.read().decode('utf-8')
            logger.error(f"无法创建远程目录 {remote_dir}: {error}")
            raise Exception(f"创建目录失败: {error}")
        logger.info(f"创建远程目录: {remote_dir}")
    except Exception as e:
        logger.error(f"创建目录时发生错误: {str(e)}")
        raise

def receive_and_upload_file(local_file, config_file, remote_dir):
    """接收本地文件并上传到 SFTP 服务器"""
    # 加载 SFTP 配置
    sftp_server, sftp_username, sftp_password, sftp_port = load_config(config_file)
    
    # 上传文件
    result = upload_file_to_sftp(local_file, remote_dir, sftp_server, sftp_username, sftp_password, sftp_port)
    return result

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python sftp_upload.py <本地文件路径> [配置文件路径]")
        sys.exit(1)
    
    local_file = sys.argv[1]
    config_file = sys.argv[2] if len(sys.argv) > 2 else "../WEB-INF/config.properties"
    remote_dir = "/www/wwwroot/tv.iamcheyan.com/data"
    
    logger.info(f"开始处理文件: {local_file}")
    result = receive_and_upload_file(local_file, config_file, remote_dir)
    
    if result:
        logger.info("文件处理完成")
    else:
        logger.error("文件处理失败")
        sys.exit(1)

if __name__ == "__main__":
    main()