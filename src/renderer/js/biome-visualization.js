// ===== FILE BIOME VISUALIZATION =====

class BiomeVisualization {
  constructor() {
    this.container = null;
    this.svg = null;
    this.simulation = null;
    this.nodes = [];
    this.links = [];
    this.width = 800;
    this.height = 600;
    this.entropyLevel = 0;
    
    this.config = {
      nodeSize: { min: 5, max: 20 },
      linkDistance: 100,
      chargeStrength: -300,
      gravityStrength: 0.1,
      colors: {
        healthy: '#00ff00',
        warning: '#ffff00',
        critical: '#ff0000',
        cloaked: '#00ffff'
      }
    };
    
    this.initializeVisualization();
  }

  initializeVisualization() {
    console.log('🌿 Biome Visualization System Initialized');
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupVisualization();
      });
    } else {
      this.setupVisualization();
    }
  }

  setupVisualization() {
    this.container = document.getElementById('biome-visualization');
    if (!this.container) {
      console.warn('Biome visualization container not found');
      return;
    }
    
    this.createSVG();
    this.setupSimulation();
    this.setupEventListeners();
    this.loadMockData();
    this.render();
  }

  createSVG() {
    // Clear existing content
    this.container.innerHTML = '';
    
    // Create SVG element
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'biome-svg');
    
    // Add background
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'var(--color-surface)')
      .attr('opacity', 0.1);
    
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        this.svg.selectAll('g').attr('transform', event.transform);
      });
    
    this.svg.call(zoom);
  }

  setupSimulation() {
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(this.config.linkDistance))
      .force('charge', d3.forceManyBody().strength(this.config.chargeStrength))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('gravity', d3.forceManyBody().strength(this.config.gravityStrength));
  }

  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeVisualization();
    });
    
    // Handle theme changes
    document.addEventListener('themeChanged', (e) => {
      this.updateColors();
    });
  }

  loadMockData() {
    // Generate mock file nodes
    this.nodes = this.generateMockNodes(50);
    this.links = this.generateMockLinks(this.nodes);
    
    // Update simulation
    this.simulation.nodes(this.nodes);
    this.simulation.force('link').links(this.links);
  }

  generateMockNodes(count) {
    const fileTypes = ['pdf', 'doc', 'jpg', 'png', 'mp4', 'zip', 'txt', 'exe'];
    const categories = ['work', 'personal', 'media', 'documents', 'backup'];
    
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 1000000 + 1000; // 1KB to 1MB
      const lastAccessed = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // 0-30 days ago
      const health = this.calculateFileHealth(size, lastAccessed);
      
      nodes.push({
        id: `file_${i}`,
        name: `file_${i}.${fileTypes[Math.floor(Math.random() * fileTypes.length)]}`,
        size: size,
        type: fileTypes[Math.floor(Math.random() * fileTypes.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        lastAccessed: lastAccessed,
        health: health,
        cloaked: Math.random() < 0.1, // 10% chance of being cloaked
        x: Math.random() * this.width,
        y: Math.random() * this.height
      });
    }
    
    return nodes;
  }

  generateMockLinks(nodes) {
    const links = [];
    const categories = {};
    
    // Group nodes by category
    nodes.forEach(node => {
      if (!categories[node.category]) {
        categories[node.category] = [];
      }
      categories[node.category].push(node);
    });
    
    // Create links within categories
    Object.values(categories).forEach(categoryNodes => {
      for (let i = 0; i < categoryNodes.length - 1; i++) {
        links.push({
          source: categoryNodes[i].id,
          target: categoryNodes[i + 1].id,
          strength: 0.5
        });
      }
    });
    
    // Create some cross-category links
    const allNodes = Object.values(categories).flat();
    for (let i = 0; i < allNodes.length / 4; i++) {
      const source = allNodes[Math.floor(Math.random() * allNodes.length)];
      const target = allNodes[Math.floor(Math.random() * allNodes.length)];
      
      if (source.id !== target.id) {
        links.push({
          source: source.id,
          target: target.id,
          strength: 0.2
        });
      }
    }
    
    return links;
  }

  calculateFileHealth(size, lastAccessed) {
    const daysSinceAccess = (Date.now() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
    const sizeScore = Math.min(size / 1000000, 1); // Normalize to 1MB
    const timeScore = Math.max(0, 1 - daysSinceAccess / 30); // Decay over 30 days
    
    const health = (sizeScore * 0.3 + timeScore * 0.7);
    
    if (health > 0.7) return 'healthy';
    if (health > 0.3) return 'warning';
    return 'critical';
  }

  render() {
    if (!this.svg) return;
    
    // Create link elements
    const links = this.svg.append('g')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('class', 'biome-link')
      .style('stroke', 'var(--color-border)')
      .style('stroke-width', 1)
      .style('opacity', 0.3);
    
    // Create node elements
    const nodes = this.svg.append('g')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('class', 'biome-node')
      .attr('r', d => this.getNodeSize(d))
      .style('fill', d => this.getNodeColor(d))
      .style('stroke', 'var(--color-primary)')
      .style('stroke-width', 2)
      .style('opacity', 0.8)
      .call(this.dragBehavior());
    
    // Add node labels
    const labels = this.svg.append('g')
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('class', 'biome-label')
      .text(d => d.name.length > 10 ? d.name.substring(0, 10) + '...' : d.name)
      .style('font-size', '10px')
      .style('fill', 'var(--color-text-secondary)')
      .style('text-anchor', 'middle')
      .style('pointer-events', 'none');
    
    // Add tooltips
    nodes.append('title')
      .text(d => `${d.name}\nSize: ${this.formatFileSize(d.size)}\nHealth: ${d.health}\nLast accessed: ${d.lastAccessed.toLocaleDateString()}`);
    
    // Update positions on simulation tick
    this.simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y + 15);
    });
    
    // Add hover effects
    nodes
      .on('mouseover', (event, d) => {
        this.highlightNode(d);
      })
      .on('mouseout', () => {
        this.clearHighlight();
      })
      .on('click', (event, d) => {
        this.selectNode(d);
      });
  }

  dragBehavior() {
    return d3.drag()
      .on('start', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }

  getNodeSize(node) {
    const baseSize = this.config.nodeSize.min;
    const sizeRange = this.config.nodeSize.max - this.config.nodeSize.min;
    const sizeFactor = Math.log(node.size) / Math.log(1000000); // Log scale
    return baseSize + (sizeFactor * sizeRange);
  }

  getNodeColor(node) {
    if (node.cloaked) {
      return this.config.colors.cloaked;
    }
    
    switch (node.health) {
      case 'healthy':
        return this.config.colors.healthy;
      case 'warning':
        return this.config.colors.warning;
      case 'critical':
        return this.config.colors.critical;
      default:
        return this.config.colors.healthy;
    }
  }

  formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  highlightNode(node) {
    // Highlight connected nodes
    const connectedNodes = this.links
      .filter(link => link.source.id === node.id || link.target.id === node.id)
      .map(link => link.source.id === node.id ? link.target : link.source);
    
    this.svg.selectAll('.biome-node')
      .style('opacity', d => 
        d.id === node.id || connectedNodes.some(n => n.id === d.id) ? 1 : 0.2
      );
    
    this.svg.selectAll('.biome-link')
      .style('opacity', d => 
        d.source.id === node.id || d.target.id === node.id ? 0.8 : 0.1
      );
  }

  clearHighlight() {
    this.svg.selectAll('.biome-node')
      .style('opacity', 0.8);
    
    this.svg.selectAll('.biome-link')
      .style('opacity', 0.3);
  }

  selectNode(node) {
    // Show node details in a modal or panel
    if (window.quantumUI) {
      window.quantumUI.showModal('node-details', {
        title: 'File Details',
        body: `
          <div class="node-details">
            <h4>${node.name}</h4>
            <p><strong>Size:</strong> ${this.formatFileSize(node.size)}</p>
            <p><strong>Type:</strong> ${node.type}</p>
            <p><strong>Category:</strong> ${node.category}</p>
            <p><strong>Health:</strong> <span class="health-${node.health}">${node.health}</span></p>
            <p><strong>Last Accessed:</strong> ${node.lastAccessed.toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${node.cloaked ? 'Cloaked' : 'Visible'}</p>
          </div>
        `,
        footer: `
          <button class="quantum-btn" onclick="window.biomeVisualization.cloakNode('${node.id}')">
            ${node.cloaked ? 'Uncloak' : 'Cloak'} File
          </button>
          <button class="quantum-btn" onclick="window.biomeVisualization.deleteNode('${node.id}')">
            Delete File
          </button>
        `
      });
    }
  }

  cloakNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.cloaked = !node.cloaked;
      this.updateNodeVisualization(node);
      
      if (window.quantumUI) {
        window.quantumUI.showNotification(
          `File ${node.cloaked ? 'cloaked' : 'uncloaked'} successfully`,
          'success'
        );
      }
    }
  }

  deleteNode(nodeId) {
    const nodeIndex = this.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex !== -1) {
      this.nodes.splice(nodeIndex, 1);
      
      // Remove related links
      this.links = this.links.filter(link => 
        link.source.id !== nodeId && link.target.id !== nodeId
      );
      
      this.updateVisualization();
      
      if (window.quantumUI) {
        window.quantumUI.showNotification('File deleted successfully', 'success');
      }
    }
  }

  updateNodeVisualization(node) {
    this.svg.selectAll('.biome-node')
      .filter(d => d.id === node.id)
      .style('fill', this.getNodeColor(node));
  }

  updateVisualization() {
    // Update simulation
    this.simulation.nodes(this.nodes);
    this.simulation.force('link').links(this.links);
    this.simulation.alpha(1).restart();
    
    // Re-render
    this.render();
  }

  updateEntropyLevel(entropy) {
    this.entropyLevel = entropy;
    
    // Update node colors based on entropy
    this.nodes.forEach(node => {
      node.health = this.calculateFileHealthWithEntropy(node.size, node.lastAccessed, entropy);
    });
    
    this.updateVisualization();
  }

  calculateFileHealthWithEntropy(size, lastAccessed, entropy) {
    const baseHealth = this.calculateFileHealth(size, lastAccessed);
    const entropyFactor = 1 - (entropy / 100);
    
    // Adjust health based on entropy
    if (baseHealth === 'healthy' && entropyFactor < 0.5) return 'warning';
    if (baseHealth === 'warning' && entropyFactor < 0.3) return 'critical';
    
    return baseHealth;
  }

  resizeVisualization() {
    if (!this.container) return;
    
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    if (this.svg) {
      this.svg
        .attr('width', this.width)
        .attr('height', this.height);
      
      // Update simulation center
      this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
      this.simulation.alpha(1).restart();
    }
  }

  updateColors() {
    // Update colors based on current theme
    this.svg.selectAll('.biome-link')
      .style('stroke', 'var(--color-border)');
    
    this.svg.selectAll('.biome-node')
      .style('stroke', 'var(--color-primary)');
    
    this.svg.selectAll('.biome-label')
      .style('fill', 'var(--color-text-secondary)');
  }

  // ===== PUBLIC API =====
  initialize() {
    this.setupVisualization();
  }

  updateData(data) {
    if (data.nodes) {
      this.nodes = data.nodes;
    }
    if (data.links) {
      this.links = data.links;
    }
    
    this.updateVisualization();
  }

  refresh() {
    this.loadMockData();
    this.updateVisualization();
  }

  // ===== UTILITY METHODS =====
  getNodeById(id) {
    return this.nodes.find(node => node.id === id);
  }

  getNodesByCategory(category) {
    return this.nodes.filter(node => node.category === category);
  }

  getNodesByHealth(health) {
    return this.nodes.filter(node => node.health === health);
  }

  getCloakedNodes() {
    return this.nodes.filter(node => node.cloaked);
  }
}

// Initialize biome visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.biomeVisualization = new BiomeVisualization();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BiomeVisualization;
} 