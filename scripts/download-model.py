#!/usr/bin/env python3
"""
从 ModelScope 下载 Qwen3.5-4B
模型默认下载到 ~/.cache/modelscope/hub/ (ModelScope 默认缓存)
用法: python3 scripts/download-model.py
"""

import sys
import os

def main():
    print('从 ModelScope 下载 Qwen3.5-4B...\n')
    
    try:
        from modelscope import snapshot_download
    except ImportError:
        print('请先安装 modelscope:')
        print('  pip install modelscope')
        sys.exit(1)
    
    # ModelScope 默认下到 ~/.cache/modelscope/hub/Qwen/Qwen3.5-4B
    path = snapshot_download('Qwen/Qwen3.5-4B')
    
    print(f'\n下载完成: {path}')
    print(f'\n设置环境变量:')
    print(f'  export QWEN35_MODEL_PATH={path}')
    print(f'\n或加到 ~/.zshrc / ~/.bashrc:')
    print(f'  echo \'export QWEN35_MODEL_PATH={path}\' >> ~/.zshrc')
    print(f'\n然后跑布局检查:')
    print(f'  python3 skills/frame-check/scripts/frame-check.py out/check.png')


if __name__ == '__main__':
    main()
