import os
from PIL import Image
import glob

def resize_images(input_dir, output_size=(64, 64)):
    """
    将指定目录中的所有图片缩放到指定大小
    
    参数:
        input_dir: 输入图片目录
        output_size: 目标尺寸，默认为(32, 32)
    """
    # 确保输入目录存在
    if not os.path.exists(input_dir):
        print(f"目录 {input_dir} 不存在!")
        return
    
    # 获取所有图片文件
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.gif']
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(input_dir, ext)))
        image_files.extend(glob.glob(os.path.join(input_dir, ext.upper())))
    
    if not image_files:
        print(f"在 {input_dir} 中没有找到图片文件!")
        return
    
    # 创建输出目录（如果不存在）
    output_dir = os.path.join(input_dir, "resized")
    os.makedirs(output_dir, exist_ok=True)
    
    # 处理每个图片
    for img_path in image_files:
        try:
            # 打开图片
            img = Image.open(img_path)
            
            # 缩放图片
            resized_img = img.resize(output_size, Image.Resampling.LANCZOS)
            
            # 保存缩放后的图片
            filename = os.path.basename(img_path)
            output_path = os.path.join(output_dir, filename)
            resized_img.save(output_path)
            # 打印绝对路径而不是仅文件名
            print(f"已缩放: {os.path.abspath(output_path)}")
            
        except Exception as e:
            print(f"处理 {img_path} 时出错: {e}")

if __name__ == "__main__":
    # 设置输入目录路径
    input_directory = "../img"
    
    # 调用函数缩放图片
    resize_images(input_directory)
    
    print("缩放完成！缩放后的图片保存在 ../../img/resized 目录中")