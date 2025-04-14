<?php
// 设置响应头
header('Content-Type: application/json');
header('Cache-Control: no-cache');

// 获取请求的角色名称
$characterName = isset($_GET['character']) ? $_GET['character'] : '';

if (empty($characterName)) {
    http_response_code(400);
    echo json_encode(['error' => '未指定角色名称']);
    exit;
}

// 构建动画配置文件路径
$animationFile = 'Animations/' . $characterName . '.json';

// 检查文件是否存在
if (!file_exists($animationFile)) {
    http_response_code(404);
    echo json_encode(['error' => "找不到角色 $characterName 的动画配置"]);
    exit;
}

// 读取并解析JSON配置文件
$animationConfig = file_get_contents($animationFile);
$animationData = json_decode($animationConfig, true);

// 输出动画配置数据
echo $animationConfig;
?>
