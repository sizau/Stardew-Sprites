<?php
// 设置响应头
header('Content-Type: application/json');
header('Cache-Control: no-cache');

// 获取Characters目录下的所有PNG文件
$charactersDir = 'Characters';
$files = glob($charactersDir . '/*.png');

// 提取文件名
$characters = array_map(function($path) use ($charactersDir) {
    return str_replace($charactersDir . '/', '', $path);
}, $files);

// 输出JSON格式的文件列表
echo json_encode($characters);
?>
