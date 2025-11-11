// admin-panel.js - 管理面板功能模块
// 整合了HTML中的所有管理功能

// 管理面板配置
const ADMIN_CONFIG = {
    VERSION: '2.0.0',
    FEATURES: {
        BULK_IMPORT: true,
        PRODUCT_DELETION: true,
        STATISTICS: true,
        EXPORT_CSV: true,
        DATA_MANAGEMENT: true
    },
    SECURITY: {
        ENABLED: true,
        HOTKEYS: ['Ctrl+Alt+A', '长按Logo 3秒']
    }
};

// 主管理面板功能
export function enableAdminPanel() {
    if (document.getElementById('admin-toggle')) {
        console.log('⚡ 管理面板已存在');
        return;
    }
    
    console.log('🚀 初始化管理面板...');
    createAdminPanelHTML();
    setupEventListeners();
    setupKeyboardShortcuts();
    
    // 显示加载成功提示
    showAdminNotification('✅ Pannello Admin caricato con successo!', 'success');
}

// 创建管理面板HTML结构
function createAdminPanelHTML() {
    const adminHTML = `
        <!-- 管理面板触发按钮 -->
        <button id="admin-toggle" 
                style="position:fixed; bottom:20px; right:80px; 
                       background:var(--primary-color); color:white; 
                       border:none; width:50px; height:50px; border-radius:50%; 
                       display:flex; align-items:center; justify-content:center; 
                       cursor:pointer; box-shadow:var(--shadow); z-index:9999; 
                       font-size:1.2rem; transition: all 0.3s ease;"
                title="Pannello Admin (Ctrl+Alt+A)">
            🔧
        </button>

        <!-- 主管理面板 -->
        <div id="admin-panel" 
             style="display:none; position:fixed; top:50%; left:50%; 
                    transform:translate(-50%, -50%); background:white; 
                    padding:2rem; border-radius:15px; box-shadow:0 20px 60px rgba(0,0,0,0.3); 
                    z-index:10000; max-width:500px; width:95%; max-height:90vh; 
                    overflow-y:auto; border:3px solid var(--primary-color);">
            
            <!-- 面板头部 -->
            <div style="display:flex; justify-content:space-between; align-items:center; 
                        margin-bottom:1.5rem; border-bottom:2px solid var(--primary-color); 
                        padding-bottom:0.5rem;">
                <div>
                    <h3 style="color:var(--primary-color); margin:0; display:flex; align-items:center; gap:0.5rem;">
                        🛠️ Pannello Admin
                    </h3>
                    <small style="color:#666; font-size:0.8rem;">v${ADMIN_CONFIG.VERSION}</small>
                </div>
                <button onclick="window.closeAdminPanel()" 
                        style="background:none; border:none; font-size:1.5rem; 
                               cursor:pointer; color:var(--dark-color); padding:0.5rem; 
                               border-radius:50%; transition:background 0.3s ease;"
                        onmouseover="this.style.background='#f0f0f0'"
                        onmouseout="this.style.background='transparent'">
                    &times;
                </button>
            </div>

            <!-- 快速统计 -->
            <div id="admin-stats" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
                <div style="background:#f8f9fa; padding:1rem; border-radius:8px; text-align:center; border-left:4px solid var(--primary-color);">
                    <div style="font-size:2rem; font-weight:bold; color:var(--primary-color);" id="total-products">0</div>
                    <div style="font-size:0.8rem; color:#666;">Prodotti Totali</div>
                </div>
                <div style="background:#f8f9fa; padding:1rem; border-radius:8px; text-align:center; border-left:4px solid #28a745;">
                    <div style="font-size:2rem; font-weight:bold; color:#28a745;" id="total-categories">0</div>
                    <div style="font-size:0.8rem; color:#666;">Categorie</div>
                </div>
            </div>

            <!-- 功能按钮网格 -->
            <div style="display:grid; gap:1rem; margin-bottom:1.5rem;">
                <!-- 批量导入 -->
                <button class="admin-btn" onclick="window.showBulkImportSection()" 
                        style="background:var(--primary-color);">
                    <i class="fas fa-upload"></i> Importazione Massiva CSV
                </button>

                <!-- 产品删除 -->
                <div style="background:#fff3cd; padding:1rem; border-radius:8px; border-left:4px solid #ffc107;">
                    <h4 style="margin:0 0 0.5rem 0; color:#856404; display:flex; align-items:center; gap:0.5rem;">
                        <i class="fas fa-exclamation-triangle"></i> Eliminazione Prodotti
                    </h4>
                    <div style="display:flex; gap:0.5rem;">
                        <input type="text" id="delete-barcode" 
                               placeholder="Codice a barre..." 
                               style="flex:1; padding:0.8rem; border:1px solid #ddd; 
                                      border-radius:4px; font-family:monospace;"
                               onkeypress="if(event.key==='Enter') window.deleteProductByBarcode()">
                        <button class="admin-btn" onclick="window.deleteProductByBarcode()" 
                                style="background:#dc3545; min-width:80px;">
                            <i class="fas fa-trash"></i> Elimina
                        </button>
                    </div>
                </div>

                <!-- 工具按钮 -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                    <button class="admin-btn" onclick="window.viewProductStats()" 
                            style="background:#fd7e14;">
                        <i class="fas fa-chart-bar"></i> Statistiche
                    </button>
                    <button class="admin-btn" onclick="window.exportProductCSV()" 
                            style="background:#28a745;">
                        <i class="fas fa-download"></i> Esporta CSV
                    </button>
                </div>

                <!-- 数据管理 -->
                <button class="admin-btn" onclick="window.showDataManagementSection()" 
                        style="background:#6f42c1;">
                    <i class="fas fa-database"></i> Gestione Dati
                    </button>

                <!-- 危险操作 -->
                <div style="background:#f8d7da; padding:1rem; border-radius:8px; border-left:4px solid #dc3545;">
                    <h4 style="margin:0 0 0.5rem 0; color:#721c24; display:flex; align-items:center; gap:0.5rem;">
                        <i class="fas fa-radiation"></i> Operazioni Pericolose
                    </h4>
                    <button class="admin-btn" onclick="window.clearAllProductsConfirm()" 
                            style="background:#dc3545; width:100%;">
                        <i class="fas fa-broom"></i> Cancella Tutti i Dati
                    </button>
                </div>
            </div>

            <!-- 批量导入区域 -->
            <div id="bulk-import-section" style="display:none; margin-top:1rem; padding-top:1rem; border-top:1px solid #ddd;">
                <h4 style="margin-bottom:1rem; color:var(--primary-color);">
                    <i class="fas fa-file-csv"></i> Importazione Massiva
                </h4>
                <textarea id="csv-data" 
                          placeholder="Incolla i dati CSV qui...
Formato: nome,prezzo,prezzo_scontato,codice_barre,categoria,descrizione,immagine
Esempio: Penna Bic,1.50,1.20,8005123456789,cartoleria,Penna blu,https://..."
                          style="width:100%; height:150px; padding:1rem; border:1px solid #ddd; 
                                 border-radius:4px; font-family:monospace; font-size:0.9rem; 
                                 resize:vertical; margin-bottom:1rem;"></textarea>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <button class="admin-btn" onclick="window.importCSVData()" 
                            style="background:#28a745;">
                        <i class="fas fa-upload"></i> Importa CSV
                    </button>
                    <button class="admin-btn" onclick="window.hideBulkImportSection()" 
                            style="background:#6c757d;">
                        <i class="fas fa-times"></i> Annulla
                    </button>
                    <button class="admin-btn" onclick="window.downloadCSVTemplate()" 
                            style="background:#17a2b8;">
                        <i class="fas fa-file-download"></i> Template CSV
                    </button>
                </div>
            </div>

            <!-- 数据管理区域 -->
            <div id="data-management-section" style="display:none; margin-top:1rem; padding-top:1rem; border-top:1px solid #ddd;">
                <h4 style="margin-bottom:1rem; color:var(--primary-color);">
                    <i class="fas fa-database"></i> Gestione Dati
                </h4>
                <div style="display:grid; gap:0.5rem;">
                    <button class="admin-btn" onclick="window.backupProducts()" 
                            style="background:#20c997;">
                        <i class="fas fa-save"></i> Backup Dati
                    </button>
                    <button class="admin-btn" onclick="window.restoreBackup()" 
                            style="background:#ffc107; color:#000;">
                        <i class="fas fa-undo"></i> Ripristina Backup
                    </button>
                    <button class="admin-btn" onclick="window.optimizeStorage()" 
                            style="background:#6f42c1;">
                        <i class="fas fa-magic"></i> Ottimizza Storage
                    </button>
                </div>
            </div>
        </div>

        <!-- 遮罩层 -->
        <div id="admin-overlay" 
             style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
                    background:rgba(0,0,0,0.5); z-index:9998;"></div>

        <!-- 通知容器 -->
        <div id="admin-notifications" 
             style="position:fixed; top:20px; right:20px; z-index:10001; 
                    max-width:400px; width:90%;"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', adminHTML);
    updateAdminStats();
}

// 设置事件监听器
function setupEventListeners() {
    const toggleBtn = document.getElementById('admin-toggle');
    const panel = document.getElementById('admin-panel');
    const overlay = document.getElementById('admin-overlay');

    if (toggleBtn && panel && overlay) {
        // 切换按钮点击
        toggleBtn.addEventListener('click', function() {
            panel.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // 遮罩层点击关闭
        overlay.addEventListener('click', closeAdminPanel);

        // 面板外部点击关闭
        panel.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAdminPanel();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && panel.style.display === 'block') {
                closeAdminPanel();
            }
        });
    }
}

// 设置键盘快捷键
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+Alt+A 切换管理面板
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            e.preventDefault();
            const panel = document.getElementById('admin-panel');
            if (panel && panel.style.display === 'block') {
                closeAdminPanel();
            } else {
                document.getElementById('admin-toggle')?.click();
            }
        }

        // Ctrl+Shift+D 显示调试信息
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            showDebugInfo();
        }
    });
}

// 关闭管理面板
export function closeAdminPanel() {
    const panel = document.getElementById('admin-panel');
    const overlay = document.getElementById('admin-overlay');
    
    if (panel) panel.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
    
    // 隐藏所有子面板
    hideBulkImportSection();
    hideDataManagementSection();
}

// 更新管理面板统计信息
function updateAdminStats() {
    if (!window.products) return;
    
    const totalProducts = window.products.length;
    const categories = new Set(window.products.map(p => p.category)).size;
    
    const totalEl = document.getElementById('total-products');
    const categoriesEl = document.getElementById('total-categories');
    
    if (totalEl) totalEl.textContent = totalProducts;
    if (categoriesEl) categoriesEl.textContent = categories;
}

// 显示批量导入区域
export function showBulkImportSection() {
    const section = document.getElementById('bulk-import-section');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 隐藏批量导入区域
export function hideBulkImportSection() {
    const section = document.getElementById('bulk-import-section');
    if (section) section.style.display = 'none';
}

// 显示数据管理区域
export function showDataManagementSection() {
    const section = document.getElementById('data-management-section');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 隐藏数据管理区域
export function hideDataManagementSection() {
    const section = document.getElementById('data-management-section');
    if (section) section.style.display = 'none';
}

// 按条码删除产品
export function deleteProductByBarcode() {
    const barcodeInput = document.getElementById('delete-barcode');
    if (!barcodeInput) return;

    const barcode = barcodeInput.value.trim();
    if (!barcode) {
        showAdminNotification('❌ Inserisci un codice a barre', 'error');
        return;
    }

    if (!window.products) {
        showAdminNotification('❌ Nessun prodotto caricato', 'error');
        return;
    }

    const initialCount = window.products.length;
    const deletedProducts = [];

    // 从内存中删除
    for (let i = window.products.length - 1; i >= 0; i--) {
        if (window.products[i].id === barcode) {
            deletedProducts.push(window.products[i]);
            window.products.splice(i, 1);
        }
    }

    if (deletedProducts.length > 0) {
        // 更新本地存储
        localStorage.setItem('supershop-products', JSON.stringify(window.products));
        
        // 更新显示
        if (window.filteredProducts && window.renderProducts) {
            window.filteredProducts = [...window.products];
            window.currentPage = 1;
            window.renderProducts();
        }

        // 更新统计
        updateAdminStats();

        // 显示成功消息
        const productNames = deletedProducts.map(p => p.name).join(', ');
        showAdminNotification(`✅ Eliminati ${deletedProducts.length} prodotti: ${productNames}`, 'success');
        
        // 清空输入框
        barcodeInput.value = '';
    } else {
        showAdminNotification('❌ Nessun prodotto trovato con questo codice', 'warning');
    }
}

// 导出CSV功能
export function exportProductCSV() {
    if (!window.products || window.products.length === 0) {
        showAdminNotification('❌ Nessun prodotto da esportare', 'warning');
        return;
    }

    try {
        // CSV头部
        const headers = ['id', 'name', 'originalPrice', 'discountPrice', 'discountPercentage', 'price', 'category', 'image', 'description'];
        const csvContent = [
            headers.join(','),
            ...window.products.map(product => [
                product.id || '',
                `"${(product.name || '').replace(/"/g, '""')}"`,
                product.originalPrice || '',
                product.discountPrice || '',
                product.discountPercentage || '',
                product.price || '',
                product.category || '',
                product.image || '',
                `"${(product.description || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `supershop-products-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showAdminNotification(`✅ CSV esportato con ${window.products.length} prodotti`, 'success');
    } catch (error) {
        console.error('Errore esportazione CSV:', error);
        showAdminNotification('❌ Errore durante l\'esportazione', 'error');
    }
}

// 下载CSV模板
export function downloadCSVTemplate() {
    const template = `id,name,originalPrice,discountPrice,discountPercentage,price,category,image,description
8021785862708,"ANGELO CERAMICA A2MOD NAT CM7X5XH12","€3,50","€1,90",,,"natale","https://example.com/image1.jpg","Descrizione prodotto"
8058641713447,"SCHIACCIANOCI CON MUSICA","€49,90",,,,"natale","https://example.com/image2.jpg","Descrizione prodotto 2"
8033113579493,"TAPPETO NATALE","€1,90","€1,00",,,"natale","https://example.com/image3.jpg","Tappeto per albero di Natale"
8000000000001,"PRODOTTO SINGOLO PREZZO",,,,"€15,99","regalo","https://example.com/image4.jpg","Prodotto con prezzo singolo"
8001234567891,"ALBERO DI NATALE 180CM","€89,90","€59,90",,,"natale","https://example.com/albero.jpg","Albero di Natale artificiale"`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-importazione-supershop.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAdminNotification('✅ Template CSV scaricato', 'success');
}

// 导入CSV数据
export function importCSVData() {
    const csvTextarea = document.getElementById('csv-data');
    if (!csvTextarea) return;

    const csvData = csvTextarea.value.trim();
    if (!csvData) {
        showAdminNotification('❌ Inserisci i dati CSV', 'warning');
        return;
    }

    try {
        const lines = csvData.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            showAdminNotification('❌ CSV non valido', 'error');
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const newProducts = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const values = parseCSVLine(line);
            
            if (values.length !== headers.length) {
                console.warn(`Riga ${i + 1} ignorata: numero di colonne non corrispondente`);
                continue;
            }

            let product = {};
            for (let j = 0; j < headers.length; j++) {
                product[headers[j]] = values[j] ? values[j].trim() : '';
            }

            // 验证产品数据
            if (!product.name || !product.id) {
                console.warn(`Riga ${i + 1} ignorata: nome o codice barre mancante`);
                continue;
            }

            // 自动计算折扣百分比
            product = calculateDiscountPercentage(product);

            newProducts.push(product);
        }

        if (newProducts.length === 0) {
            showAdminNotification('❌ Nessun prodotto valido trovato nel CSV', 'warning');
            return;
        }

        // 添加到现有产品
        if (!window.products) window.products = [];
        
        // 检查重复
        const existingBarcodes = new Set(window.products.map(p => p.id));
        const duplicates = newProducts.filter(p => existingBarcodes.has(p.id));
        const uniqueProducts = newProducts.filter(p => !existingBarcodes.has(p.id));

        // 添加唯一产品
        window.products.push(...uniqueProducts);

        // 保存到本地存储
        localStorage.setItem('supershop-products', JSON.stringify(window.products));

        // 更新显示
        if (window.filteredProducts && window.renderProducts) {
            window.filteredProducts = [...window.products];
            window.currentPage = 1;
            window.renderProducts();
        }

        // 更新统计
        updateAdminStats();

        // 显示结果
        let message = `✅ Importati ${uniqueProducts.length} nuovi prodotti`;
        if (duplicates.length > 0) {
            message += ` (${duplicates.length} duplicati ignorati)`;
        }
        
        showAdminNotification(message, 'success');
        hideBulkImportSection();
        csvTextarea.value = '';

    } catch (error) {
        console.error('Errore importazione CSV:', error);
        showAdminNotification('❌ Errore durante l\'importazione CSV', 'error');
    }
}

// 自动计算折扣百分比
function calculateDiscountPercentage(product) {
    // 如果有原价和折扣价，自动计算折扣百分比
    if (product.originalprice && product.discountprice && !product.discountpercentage) {
        // 提取价格数值（移除货币符号和逗号）
        const original = parseFloat(product.originalprice.replace('€', '').replace(',', '.'));
        const discount = parseFloat(product.discountprice.replace('€', '').replace(',', '.'));
        
        if (original > 0 && discount > 0 && original > discount) {
            // 保留两位小数
            const discountPercent = parseFloat((((original - discount) / original) * 100).toFixed(2));
            product.discountpercentage = discountPercent;
        }
    }
    
    // 如果只有单一价格，设置折扣百分比为0
    if ((product.price) && !product.discountpercentage) {
        product.discountpercentage = 0;
    }
    
    return product;
}

// 解析CSV行（处理引号和逗号）
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current.trim());
    return values.map(v => v.replace(/^"|"$/g, ''));
}

// 查看产品统计
export function viewProductStats() {
    if (!window.products || window.products.length === 0) {
        showAdminNotification('❌ Nessun prodotto disponibile', 'warning');
        return;
    }

    const stats = {
        total: window.products.length,
        byCategory: {},
        withDiscount: window.products.filter(p => p.discountPrice).length,
        withImages: window.products.filter(p => p.image).length
    };

    // 按类别统计
    window.products.forEach(product => {
        const category = product.category || 'senza-categoria';
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    // 创建统计信息HTML
    let statsHTML = `
        <div style="background:#f8f9fa; padding:1rem; border-radius:8px; margin-bottom:1rem;">
            <h4 style="margin:0 0 1rem 0; color:var(--primary-color);">
                <i class="fas fa-chart-pie"></i> Statistiche Prodotti
            </h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div>
                    <strong>Totale Prodotti:</strong> ${stats.total}<br>
                    <strong>Con Sconto:</strong> ${stats.withDiscount}<br>
                    <strong>Con Immagini:</strong> ${stats.withImages}
                </div>
                <div>
                    <strong>Per Categoria:</strong><br>
                    ${Object.entries(stats.byCategory).map(([cat, count]) => 
                        `${getCategoryLabel(cat)}: ${count} (${((count/stats.total)*100).toFixed(1)}%)`
                    ).join('<br>')}
                </div>
            </div>
        </div>
    `;

    showAdminNotification(statsHTML, 'info', 10000); // 显示10秒
}

// 获取分类标签
function getCategoryLabel(category) {
    const categoryLabels = {
        'regalo': 'Articoli Regalo',
        'giocattoli': 'Giocattoli',
        'cartoleria': 'Cartoleria',
        'casalinghi': 'Casalinghi',
        'ferramenta': 'Ferramenta',
        'animali': 'Articoli per Animali',
        'illuminazione': 'Illuminazione',
        'mobili': 'Mobili',
        'natale': '🎄 Articoli Natalizi'
    };
    return categoryLabels[category] || category;
}

// 数据备份
export function backupProducts() {
    if (!window.products || window.products.length === 0) {
        showAdminNotification('❌ Nessun dato da salvare', 'warning');
        return;
    }

    const backup = {
        timestamp: new Date().toISOString(),
        version: ADMIN_CONFIG.VERSION,
        productCount: window.products.length,
        data: window.products
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `supershop-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAdminNotification(`✅ Backup creato con ${window.products.length} prodotti`, 'success');
}

// 优化存储
export function optimizeStorage() {
    try {
        // 清理空值
        if (window.products) {
            window.products = window.products.filter(product => 
                product && product.id && product.name
            );
            
            localStorage.setItem('supershop-products', JSON.stringify(window.products));
        }

        // 清理过期的本地存储项
        const validKeys = ['supershop-products', 'preferredLanguage', 'languageConsentGiven'];
        Object.keys(localStorage).forEach(key => {
            if (!validKeys.includes(key) && key.startsWith('supershop-')) {
                localStorage.removeItem(key);
            }
        });

        showAdminNotification('✅ Storage ottimizzato con successo', 'success');
        updateAdminStats();
        
    } catch (error) {
        console.error('Errore ottimizzazione storage:', error);
        showAdminNotification('❌ Errore durante l\'ottimizzazione', 'error');
    }
}

// 确认清除所有数据
export function clearAllProductsConfirm() {
    if (!window.products || window.products.length === 0) {
        showAdminNotification('❌ Nessun dato da cancellare', 'warning');
        return;
    }

    const confirmation = confirm(
        `⚠️ ATTENZIONE!\n\nStai per cancellare TUTTI i ${window.products.length} prodotti.\n\n` +
        `Questa operazione non può essere annullata.\n\n` +
        `Sei sicuro di voler procedere?`
    );

    if (confirmation) {
        clearAllProducts();
    }
}

// 清除所有产品数据
function clearAllProducts() {
    try {
        const productCount = window.products ? window.products.length : 0;
        
        // 清除内存中的数据
        window.products = [];
        window.filteredProducts = [];
        
        // 清除本地存储
        localStorage.removeItem('supershop-products');
        
        // 更新显示
        if (window.renderProducts) {
            window.renderProducts();
        }
        
        // 更新统计
        updateAdminStats();
        
        showAdminNotification(`✅ Cancellati ${productCount} prodotti`, 'success');
        closeAdminPanel();
        
    } catch (error) {
        console.error('Errore cancellazione prodotti:', error);
        showAdminNotification('❌ Errore durante la cancellazione', 'error');
    }
}

// 显示管理通知
function showAdminNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('admin-notifications');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.style.cssText = `
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        cursor: pointer;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
            <div style="flex-shrink: 0; font-size: 1.2rem;">${getNotificationIcon(type)}</div>
            <div style="flex: 1;">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">
                &times;
            </button>
        </div>
    `;

    container.appendChild(notification);

    // 自动移除
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }

    // 点击移除
    notification.addEventListener('click', function() {
        this.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => this.remove(), 300);
    });
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// 显示调试信息
function showDebugInfo() {
    const debugInfo = {
        'Admin Panel Version': ADMIN_CONFIG.VERSION,
        'Products Count': window.products ? window.products.length : 0,
        'Local Storage Usage': `${JSON.stringify(localStorage).length} bytes`,
        'User Agent': navigator.userAgent,
        'Viewport': `${window.innerWidth} x ${window.innerHeight}`,
        'Timestamp': new Date().toISOString()
    };

    console.table(debugInfo);
    showAdminNotification('🔧 Debug info logged in console', 'info', 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .admin-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.8rem 1rem;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .admin-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .admin-btn:active {
        transform: translateY(0);
    }
    
    #admin-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);

// 导出所有函数到全局作用域
window.enableAdminPanel = enableAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.showBulkImportSection = showBulkImportSection;
window.hideBulkImportSection = hideBulkImportSection;
window.showDataManagementSection = showDataManagementSection;
window.hideDataManagementSection = hideDataManagementSection;
window.deleteProductByBarcode = deleteProductByBarcode;
window.exportProductCSV = exportProductCSV;
window.downloadCSVTemplate = downloadCSVTemplate;
window.importCSVData = importCSVData;
window.viewProductStats = viewProductStats;
window.backupProducts = backupProducts;
window.optimizeStorage = optimizeStorage;
window.clearAllProductsConfirm = clearAllProductsConfirm;

console.log('🛠️ Admin Panel v' + ADMIN_CONFIG.VERSION + ' loaded successfully');
console.log('🔑 Hotkeys: Ctrl+Alt+A to toggle, Ctrl+Shift+D for debug info');