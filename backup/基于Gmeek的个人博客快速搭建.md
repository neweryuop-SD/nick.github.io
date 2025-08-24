
## 1. 什么是Gmeek？

Gmeek是一个**完全基于GitHub生态系统**的超轻量级博客框架，它创新性地将GitHub的三大核心功能融合在一起，形成了无缝的博客创作和发布流程。具体来说：

- **GitHub Pages**：提供静态网站托管服务，自动启用HTTPS，支持自定义域名，完全免费且拥有极高的可靠性。
    
- **GitHub Issues**：作为博客内容管理系统(CMS)，提供友良好的Markdown编辑界面，支持图片拖拽上传，标签分类和评论互动。
    
- **GitHub Actions**：实现自动化工作流，当用户在Issues中创建或修改内容时，自动触发静态网站生成和部署过程，无需人工干预。
## 2. Gmeek的核心优势

Gmeek相对于传统博客平台具有显著优势，特别适合技术爱好者和内容创作者：

- **极致简化**：从搭建到写作只需3步，耗时不到18秒，用户无需学习复杂的命令行操作或本地环境配置。
    
- **完全免费**：利用GitHub的免费服务，不需要支付服务器租赁、域名备案或SSL证书费用，真正零成本运营。
    
- **内容持久**：GitHub作为全球最大的代码托管平台，已成为互联网基础设施的重要组成部分，存放在其上的内容具有**长期可访问性**，远超一般商业平台的寿命。
    
- **自动化工作流**：写作完成后自动触发部署流程，通常5分钟内即可通过网站访问新内容，极大简化了发布过程。
## 3.快速搭建

### 3.1准备工作与初始配置

在开始使用Gmeek之前，您只需要准备一个GitHub账号。无需任何技术背景或本地开发环境，所有操作都通过浏览器完成。以下是详细步骤：

1. **通过模板创建仓库**：访问Gmeek的模板仓库（[https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai](https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai)），点击"Use this template"按钮。建议仓库命名格式为`用户名.github.io`（例如用户名为"tech-shrimp"，则仓库名为"tech-shrimp.github.io"），这样可以直接获得标准的GitHub Pages域名。
    
2. **启用GitHub Pages**：进入新创建的仓库，点击"Settings"选项卡，选择左侧的"Pages"菜单。在"Build and deployment"部分的"Source"下拉框中，选择"GitHub Actions"。这一步骤是关键，它允许Gmeek的自动化工作流将生成的静态网站部署到Pages服务。
    
3. **初始构建触发**：完成上述设置后，系统通常会自动触发首次构建。您可以通过点击仓库顶部的"Actions"选项卡查看构建进度。当看到所有步骤都显示绿色对勾时，表示构建成功。此时，您的博客已经可以通过`https://用户名.github.io`访问。
### 3.2 写作与发布流程

Gmeek的内容创作流程极其简单，完全基于GitHub Issues界面：

1. **创建新文章**：在仓库页面点击"Issues"选项卡，然后点击绿色的"New issue"按钮，即可开始写作。（不过注意要备份issues）
    
2. **使用Markdown写作**：GitHub Issues支持完整的Markdown语法，包括：
    
    - 多级标题（使用`#`到`######`表示六级标题）
        
    - 文本格式（`**粗体**`、`*斜体*`、`~~删除线~~`）
        
    - 代码块（使用三个反引号包裹代码，并指定语言类型）
        
    - 任务列表（`- [ ] 未完成任务`和`- [x] 已完成任务`）
        
    - 表格、引用块和分隔线等
    
	也可以使用github自带的快捷编辑
	
3. **图片插入技巧**：可以直接将本地图片拖拽到Issue编辑区，GitHub会自动上传图片并生成Markdown格式的链接，无需手动处理图床或文件存储。
    
4. **添加标签**：这是**关键步骤**——在右侧栏的"Labels"部分，必须为文章添加至少一个标签。标签在Gmeek中充当文章分类的功能，没有标签的文章不会被纳入构建流程。您可以点击"Labels"旁边的齿轮图标创建自定义标签，如"技术"、"生活"、"教程"等。
    
5. **发布文章**：点击"Submit new issue"完成发布。保存后，GitHub Actions会自动检测到内容变更，触发构建流程。通常等待3-5分钟，文章就会出现在您的博客上。
### 3.3 现有仓库升级方案

对于已经拥有GitHub Pages仓库的用户，Gmeek提供了无需删除原有仓库的解决方案，有两种方法可以实现：

1. **多仓库共存方案**：创建一个新仓库（如命名为"blog"）专门用于Gmeek博客，最终访问地址为`username.github.io/blog`。这种方案完全独立于原有Pages，互不干扰，适合大多数场景。
    
2. **原仓库改造方案**：如果您希望保留原有仓库中的内容和历史记录，可以手动将Gmeek的配置文件添加到现有仓库：
    
    - 从Gmeek模板仓库复制`.github/workflows/Gmeek.yml`文件到您的仓库对应位置
        
    - 同样复制`config.json`配置文件到仓库根目录
        
    - 在仓库Settings的Pages选项中，将Source切换为Github Actions
        
    - 手动触发首次构建（Actions > build Gmeek > Run workflow）

### 3.4 常见问题

- **构建失败**  检查Actions日志，常见于配置错误  
- **文章未显示**  确认ssue已添加标签
- **样式异常**  检查config.json中资源路径
- **访问404** 确认Pages源设置为GitHub Actions（完成配置后就不要更改Pages源了）
## 4.个性化定制与高级功能

### 4.1 界面与主题定制

虽然Gmeek默认使用GitHub风格的界面设计，但它仍提供了多种个性化定制选项：

- **基本信息**：通过修改`config.json`文件中的基本配置项，可以轻松定义博客的整体标识：
```
{
  "title": "您的博客名称",
  "subTitle": "一句吸引人的描述语",
  "avatarUrl": "头像url",
  "displayTitle": "显示在头像后的标题",
  "faviconUrl": "网页页面图标url"
}
```
- **颜色与主题方案**：Gmeek支持**明暗模式**切换，并允许自定义多种颜色选项：
    
    - `yearColorList`：为不同年份的文章标签指定不同的颜色，增强视觉层次感
        
    - `commentLabelColor`：设置评论数量标签的颜色
        
    - `dayTheme`和`nightTheme`：分别定义明暗主题的配色方案
    
    对于有CSS经验的人来说，还可以通过`style`参数注入自定义CSS规则，实现更精细的样式控制。

- **布局与结构**：Gmeek使用Jinja2模板引擎生成HTML，这意味着高级用户可以通过自定义模板彻底改变博客的布局和结构。我们可以修改页面模块的组织方式，添加新区域，或者重新设计整体排版。
### 4.2 高级功能配置

Gmeek还提供了一系列高级功能增强博客的实用性和用户体验：

- **独立页面创建**：通过`singlePage`配置项，我们可以添加关于页面、友情链接页面或任何其他自定义独立页面。例如：
```
"singlePage": [
  {"name": "关于", "url": "/about"},
  {"name": "项目", "url": "/projects"}
]
```
这些页面同样通过GitHub Issues创建和管理，只需为相应的Issue添加特定的标签（如"about"）即可。
    
- **多语言支持**：Gmeek内置了国际化(i18n)支持，通过设置`i18n`参数可以定义博客的主要语言。目前支持英语(EN)、简体中文(CN)和俄语(RU)，适合面向国际读者的博客。
    
- **时间区域配置**：通过`UTC`参数设置正确的时区（例如`UTC+8`表示东八区），确保文章发布时间显示准确，这对于全球读者都很重要。
### 4.3 插件功能

Gmeek提供了各种富有功能的插件：

极简网页计数器——**不蒜子**
```
"allHead":"<script src='https://blog.meekdai.com/Gmeek/plugins/GmeekBSZ.js'></script>",
```

TOC目录
```
"script":"<script src='https://blog.meekdai.com/Gmeek/plugins/GmeekTOC.js'></script>",
```
以及更多插件：
[【Gmeek进阶】插件功能的使用](https://blog.meekdai.com/post/%E3%80%90Gmeek-jin-jie-%E3%80%91-cha-jian-gong-neng-de-shi-yong.html)
## 5.备份

_其实这一条没有必要编写的，但是在我一个下午丢失全部文章后还是写上吧_

- 定期导出Issues内容为Markdown文件存储于本地或多云环境
    
- 利用Git的克隆功能将整个仓库备份到本地或其他Git托管平台
    
- 考虑设置镜像仓库，自动同步内容到多个平台

## 6.结语

Gmeek代表了个人发布工具发展的一个重要方向：**简化技术复杂性**，**强化内容核心**，**深化社交连接**。它通过巧妙利用Git生态系统，将博客维护的 technical overhead 降到极低，让创作者可以专注于最重要的事情——内容本身。

对于技术背景有限的用户，Gmeek消除了服务器管理、软件更新和安全维护的负担；对于经验丰富的开发者，Gmeek提供了足够的定制空间和自动化流程；对于所有内容创作者，Gmeek提供了与全球开发者社区连接的独特机会。

那么，开始你的博客之旅吧