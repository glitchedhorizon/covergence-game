import React from 'react';

export default function ConvergenceGame() {
  const [gameState, setGameState] = React.useState({
    chapter: 'intro',
    playerName: '',
    playerGender: '',
    playerAlignment: '',
    choices: {},
    chatMessages: [],
    showInput: false,
    someoneTyping: null,
    phase: 'main-menu',
    discordPhase: 'initial',
    // Chapter 2 state
    chapter2Phase: 'blackness',
    examined: [],
    innkeeperMet: false,
    // Chapter 3 state
    chapter3Phase: 'departure', // departure, town-square, caravan, travelers, camp1, discovery, encounter, camp2, approach, gates, sorting, dorms, end
    day: 1, // Track which day of journey (1-3)
    // Menu system
    openMenu: null, // 'character', 'abilities', 'inventory', 'wallet', 'crafting', 'affection', 'journal', or null
    // Player stats
    stats: {
      strength: 5,
      magic: 8,
      speed: 7,
      endurance: 6,
      intelligence: 7,
      charisma: 6,
      powerTier: 'Common'
    },
    // Abilities
    abilities: [],
    // Inventory
    inventory: [],
    equippedItems: {
      weapon: null,
      armor: null,
      accessory: null
    },
    // Wallet
    money: 50, // Starting coins from letter
    // Affection levels (0-100)
    affection: {
      kira: 50,
      maya: 50,
      ethan: 50
    },
    // Journal
    quests: [],
    loreEntries: []
  });

  // Discord message queue for typing effect
  const [currentMsgIndex, setCurrentMsgIndex] = React.useState(0);
  const messagesEndRef = React.useRef(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [gameState.chatMessages, gameState.someoneTyping]);

  // Scroll to top when transmigration starts
  React.useEffect(() => {
    if (gameState.phase === 'transmigration') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (gameState.phase === 'chapter2') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [gameState.phase]);

  // Scroll to top whenever Chapter 2 phase changes
  React.useEffect(() => {
    if (gameState.phase === 'chapter2') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [gameState.chapter2Phase]);

  // Scroll to top whenever Chapter 3 phase changes
  React.useEffect(() => {
    if (gameState.phase === 'chapter3') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [gameState.chapter3Phase]);

  const getCharacterDiscussion = () => {
    const name = gameState.playerName || 'You';
    const response = gameState.choices.firstResponse || 'confident';
    
    let messages = [];
    
    if (response === 'confident') {
      messages = [
        { user: 'Kira', text: 'Good. We need that energy.', delay: 700 },
        { user: 'Maya', text: 'YEAH!! let\'s save EVERYONE!!', delay: 600 }
      ];
    } else if (response === 'tired') {
      messages = [
        { user: 'Ethan', text: 'mood honestly', delay: 600 },
        { user: 'Maya', text: 'coffee!! drink coffee!!', delay: 700 },
        { user: 'Kira', text: 'We\'ll carry you if needed.', delay: 800 }
      ];
    } else {
      messages = [
        { user: 'Maya', text: 'YESSSS HYPE TRAIN!!!', delay: 600 },
        { user: 'Ethan', text: 'you two are gonna be so loud', delay: 700 },
        { user: 'Kira', text: 'Let them be excited. It\'s been a while since we all played together.', delay: 1000 }
      ];
    }
    
    return [
      ...messages,
      { user: 'Maya', text: 'okay okay character creation time!', delay: 800 },
      { user: 'Kira', text: 'What are you all naming yourselves?', delay: 700 },
      { user: 'Ethan', text: 'probably just gonna use my actual name', delay: 800 },
      { user: 'Maya', text: 'BORING', delay: 400 },
      { user: 'Maya', text: 'I\'m gonna be like... MysticStarDreamer69', delay: 700 },
      { user: 'Kira', text: 'Maya that\'s terrible.', delay: 600 },
      { user: 'Maya', text: 'YOU\'RE TERRIBLE', delay: 500 },
      { user: 'Ethan', text: 'you\'re both terrible <3', delay: 600 },
      { user: 'Kira', text: '@' + name + ' what about you? What are you naming your character?', delay: 1000 }
    ];
  };

  // Add page tracking for dialogue-heavy scenes
  const [dialoguePage, setDialoguePage] = React.useState(0);

  // Helper functions
  const updateState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const addChoice = (key, value) => {
    setGameState(prev => ({
      ...prev,
      choices: { ...prev.choices, [key]: value }
    }));
  };

  const examine = (item) => {
    if (!gameState.examined.includes(item)) {
      setGameState(prev => ({
        ...prev,
        examined: [...prev.examined, item]
      }));
    }
  };

  // Menu functions
  const openMenu = (menuName) => {
    setGameState(prev => ({ ...prev, openMenu: menuName }));
  };

  const closeMenu = () => {
    setGameState(prev => ({ ...prev, openMenu: null }));
  };

  // ============================================
  // SAVE/LOAD SYSTEM
  // ============================================

  // Save game to slot (1, 2, or 3)
  const saveGame = (slot) => {
    const saveData = {
      ...gameState,
      saveDate: new Date().toISOString(),
      saveSlot: slot
    };
    localStorage.setItem(`convergence_save_${slot}`, JSON.stringify(saveData));
    setGameState(prev => ({ ...prev, currentSaveSlot: slot }));
    alert(`Game saved to Slot ${slot}!`);
  };

  // Get save data for a slot
  const getSaveData = (slot) => {
    const data = localStorage.getItem(`convergence_save_${slot}`);
    return data ? JSON.parse(data) : null;
  };

  // Load game from slot
  const loadGame = (slot) => {
    const saveData = getSaveData(slot);
    if (saveData) {
      setGameState(saveData);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Delete save
  const deleteSave = (slot) => {
    if (confirm(`Delete save in Slot ${slot}?`)) {
      localStorage.removeItem(`convergence_save_${slot}`);
      setGameState(prev => ({ ...prev })); // Force re-render
    }
  };

  // Get human-readable phase label
  const getPhaseLabel = (phase) => {
    const labels = {
      'opening': 'Prologue',
      'discord': 'Chapter 1 - The Call',
      'chapter2': 'Chapter 2 - Reunion',
      'chapter3': 'Chapter 3 - The Journey'
    };
    return labels[phase] || phase;
  };

  // Auto-save on chapter completion
  React.useEffect(() => {
    if ((gameState.phase === 'chapter2' && gameState.chapter2Phase === 'preparation') ||
        (gameState.phase === 'chapter3' && gameState.chapter3Phase === 'end')) {
      if (gameState.currentSaveSlot) {
        setTimeout(() => saveGame(gameState.currentSaveSlot), 2000);
      }
    }
  }, [gameState.phase, gameState.chapter2Phase, gameState.chapter3Phase]);

  // Render menu bar (shown in Chapter 3+)
  const renderMenuBar = () => {
    if (gameState.phase !== 'chapter3') return null;

    return (
      <div className="menu-bar">
        <button className={`menu-tab ${gameState.openMenu === 'character' ? 'active' : ''}`} onClick={() => openMenu('character')}>CHARACTER</button>
        <button className={`menu-tab ${gameState.openMenu === 'abilities' ? 'active' : ''}`} onClick={() => openMenu('abilities')}>ABILITIES</button>
        <button className={`menu-tab ${gameState.openMenu === 'inventory' ? 'active' : ''}`} onClick={() => openMenu('inventory')}>INVENTORY</button>
        <button className={`menu-tab ${gameState.openMenu === 'wallet' ? 'active' : ''}`} onClick={() => openMenu('wallet')}>WALLET</button>
        <button className={`menu-tab ${gameState.openMenu === 'crafting' ? 'active' : ''}`} onClick={() => openMenu('crafting')}>CRAFTING</button>
        <button className={`menu-tab ${gameState.openMenu === 'affection' ? 'active' : ''}`} onClick={() => openMenu('affection')}>AFFECTION</button>
        <button className={`menu-tab ${gameState.openMenu === 'journal' ? 'active' : ''}`} onClick={() => openMenu('journal')}>JOURNAL</button>
        <button className={`menu-tab ${gameState.openMenu === 'save' ? 'active' : ''}`} onClick={() => openMenu('save')}>SAVE</button>
      </div>
    );
  };

  // Render active menu panel
  const renderMenuPanel = () => {
    if (!gameState.openMenu) return null;

    return (
      <div className="menu-overlay" onClick={closeMenu}>
        <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
          <div className="menu-header">
            <h2>{gameState.openMenu.toUpperCase()}</h2>
            <button className="menu-close" onClick={closeMenu}>✕</button>
          </div>
          <div className="menu-content">
            {gameState.openMenu === 'character' && renderCharacterMenu()}
            {gameState.openMenu === 'abilities' && renderAbilitiesMenu()}
            {gameState.openMenu === 'inventory' && renderInventoryMenu()}
            {gameState.openMenu === 'wallet' && renderWalletMenu()}
            {gameState.openMenu === 'crafting' && renderCraftingMenu()}
            {gameState.openMenu === 'affection' && renderAffectionMenu()}
            {gameState.openMenu === 'journal' && renderJournalMenu()}
            {gameState.openMenu === 'save' && renderSaveMenu()}
          </div>
        </div>
      </div>
    );
  };

  // Main menu (start screen)
  const renderMainMenu = () => (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">CONVERGENCE</h1>
        <h2 className="game-subtitle">A Transmigration Story</h2>
        
        <div className="menu-options">
          <button className="menu-btn new-game" onClick={() => updateState({ phase: 'opening', currentSaveSlot: null })}>
            New Game
          </button>
          
          <div className="save-slots-section">
            <h3>Load Game</h3>
            <div className="save-slots">
              {[1, 2, 3].map(slot => {
                const save = getSaveData(slot);
                return (
                  <div key={slot} className={`save-slot ${save ? 'has-save' : 'empty'}`}>
                    {save ? (
                      <>
                        <div className="save-info">
                          <div className="save-slot-num">Slot {slot}</div>
                          <div className="save-name">{save.playerName || 'Unknown'}</div>
                          <div className="save-phase">{getPhaseLabel(save.phase)}</div>
                          <div className="save-date">{new Date(save.saveDate).toLocaleString()}</div>
                        </div>
                        <div className="save-actions">
                          <button className="load-btn" onClick={() => loadGame(slot)}>Load</button>
                          <button className="delete-btn" onClick={() => deleteSave(slot)}>Delete</button>
                        </div>
                      </>
                    ) : (
                      <div className="save-empty">
                        <div className="save-slot-num">Slot {slot}</div>
                        <div className="empty-text">Empty Slot</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Actual loading screen (between phases)
  const renderActualLoadingScreen = () => (
    <div className="loading-screen-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );

  // Save menu
  const renderSaveMenu = () => (
    <div className="save-menu-panel">
      <p className="save-instruction">Select a slot to save your progress:</p>
      <div className="save-slot-list">
        {[1, 2, 3].map(slot => {
          const save = getSaveData(slot);
          return (
            <div key={slot} className="save-slot-option">
              <div className="slot-header">
                <strong>Slot {slot}</strong>
                {save && <span className="overwrite-warning">(will overwrite)</span>}
              </div>
              {save && (
                <div className="existing-save-info">
                  <p className="save-preview-name">{save.playerName} - {getPhaseLabel(save.phase)}</p>
                  <p className="save-preview-date">{new Date(save.saveDate).toLocaleString()}</p>
                </div>
              )}
              <button 
                className="save-slot-btn"
                onClick={() => {
                  saveGame(slot);
                  closeMenu();
                }}
              >
                {save ? 'Overwrite Save' : 'Save Here'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Character menu
  const renderCharacterMenu = () => (
    <div className="character-info">
      <div className="info-section">
        <h3>Basic Information</h3>
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span className="info-value">{gameState.playerName}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Gender:</span>
          <span className="info-value">{gameState.playerGender}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Alignment:</span>
          <span className="info-value">{gameState.playerAlignment}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Power Tier:</span>
          <span className="info-value tier">{gameState.stats.powerTier}</span>
        </div>
      </div>

      <div className="info-section">
        <h3>Current Stats</h3>
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-name">Strength</span>
            <div className="stat-bar-wrap">
              <div className="stat-bar" style={{width: `${gameState.stats.strength * 10}%`}}></div>
            </div>
            <span className="stat-value">{gameState.stats.strength}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Magic</span>
            <div className="stat-bar-wrap">
              <div className="stat-bar" style={{width: `${gameState.stats.magic * 10}%`}}></div>
            </div>
            <span className="stat-value">{gameState.stats.magic}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Speed</span>
            <div className="stat-bar-wrap">
              <div className="stat-bar" style={{width: `${gameState.stats.speed * 10}%`}}></div>
            </div>
            <span className="stat-value">{gameState.stats.speed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Endurance</span>
            <div className="stat-bar-wrap">
              <div className="stat-bar" style={{width: `${gameState.stats.endurance * 10}%`}}></div>
            </div>
            <span className="stat-value">{gameState.stats.endurance}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Intelligence</span>
            <div className="stat-bar-wrap">
              <div className="stat-bar" style={{width: `${gameState.stats.intelligence * 10}%`}}></div>
            </div>
            <span className="stat-value">{gameState.stats.intelligence}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Charisma</span>
            <div className="stat-bar-wrap">
              <div className="stat-bar" style={{width: `${gameState.stats.charisma * 10}%`}}></div>
            </div>
            <span className="stat-value">{gameState.stats.charisma}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Abilities menu
  const renderAbilitiesMenu = () => (
    <div className="abilities-list">
      {gameState.abilities.length === 0 ? (
        <div className="empty-state">
          <p>No abilities unlocked yet.</p>
          <p className="hint">Powers will awaken during your journey...</p>
        </div>
      ) : (
        gameState.abilities.map((ability, i) => (
          <div key={i} className="ability-card">
            <h4>{ability.name}</h4>
            <p>{ability.description}</p>
          </div>
        ))
      )}
    </div>
  );

  // Inventory menu
  const renderInventoryMenu = () => (
    <div className="inventory-view">
      <div className="equipped-section">
        <h3>Equipped</h3>
        <div className="equip-slot">
          <span className="slot-name">Weapon:</span>
          <span className="slot-item">{gameState.equippedItems.weapon || 'None'}</span>
        </div>
        <div className="equip-slot">
          <span className="slot-name">Armor:</span>
          <span className="slot-item">{gameState.equippedItems.armor || 'None'}</span>
        </div>
        <div className="equip-slot">
          <span className="slot-name">Accessory:</span>
          <span className="slot-item">{gameState.equippedItems.accessory || 'None'}</span>
        </div>
      </div>
      
      <div className="items-section">
        <h3>Items</h3>
        {gameState.inventory.length === 0 ? (
          <p className="empty-state">No items in inventory.</p>
        ) : (
          <div className="item-grid">
            {gameState.inventory.map((item, i) => (
              <div key={i} className="item-card">
                <div className="item-name">{item.name}</div>
                <div className="item-desc">{item.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Wallet menu
  const renderWalletMenu = () => (
    <div className="wallet-view">
      <div className="money-display">
        <span className="money-amount">{gameState.money}</span>
        <span className="money-label">Gold Coins</span>
      </div>
      <div className="money-note">
        <p>Currency obtained from the academy letter and various sources.</p>
      </div>
    </div>
  );

  // Crafting menu
  const renderCraftingMenu = () => (
    <div className="crafting-view">
      <div className="locked-message">
        <h3>Crafting System</h3>
        <p>Not yet available.</p>
        <p className="hint">This feature will unlock as you progress through the academy.</p>
      </div>
    </div>
  );

  // Affection menu
  const renderAffectionMenu = () => (
    <div className="affection-view">
      <div className="affection-item">
        <div className="affection-header">
          <span className="character-name kira">Kira Tanaka</span>
          <span className="affection-value">{gameState.affection.kira}/100</span>
        </div>
        <div className="affection-bar-wrap">
          <div className="affection-bar kira" style={{width: `${gameState.affection.kira}%`}}></div>
        </div>
      </div>

      <div className="affection-item">
        <div className="affection-header">
          <span className="character-name maya">Maya Cross</span>
          <span className="affection-value">{gameState.affection.maya}/100</span>
        </div>
        <div className="affection-bar-wrap">
          <div className="affection-bar maya" style={{width: `${gameState.affection.maya}%`}}></div>
        </div>
      </div>

      <div className="affection-item">
        <div className="affection-header">
          <span className="character-name ethan">Ethan Reed</span>
          <span className="affection-value">{gameState.affection.ethan}/100</span>
        </div>
        <div className="affection-bar-wrap">
          <div className="affection-bar ethan" style={{width: `${gameState.affection.ethan}%`}}></div>
        </div>
      </div>
    </div>
  );

  // Journal menu
  const renderJournalMenu = () => (
    <div className="journal-view">
      <div className="journal-section">
        <h3>Active Quests</h3>
        {gameState.quests.length === 0 ? (
          <p className="empty-state">No active quests.</p>
        ) : (
          <div className="quest-list">
            {gameState.quests.map((quest, i) => (
              <div key={i} className="quest-card">
                <h4>{quest.name}</h4>
                <p>{quest.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="journal-section">
        <h3>Lore Discovered</h3>
        {gameState.loreEntries.length === 0 ? (
          <p className="empty-state">No lore entries yet.</p>
        ) : (
          <div className="lore-list">
            {gameState.loreEntries.map((entry, i) => (
              <div key={i} className="lore-card">
                <h4>{entry.title}</h4>
                <p>{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Reset dialogue page when phase changes
  React.useEffect(() => {
    setDialoguePage(0);
  }, [gameState.chapter2Phase]);

  // Get messages for each scene
  const getDialoguePages = (phase) => {
    const pages = {
      'hallway': [
        [
          { type: 'narrative', text: 'You open the door carefully.' },
          { type: 'narrative', text: 'A narrow inn hallway. Wooden floors. Several doors, all identical.' },
          { type: 'narrative', text: 'An older woman in simple clothing stands in the hall—the innkeeper, probably. She looks relieved to see you.' }
        ],
        [
          { type: 'dialogue-innkeeper', text: '"Oh good, you\'re awake! I was starting to worry. Four of you arrived three days ago, all unconscious. The doctor said you\'d wake when you were ready, but still..."' },
          { type: 'narrative', text: 'Four of you.', emphasis: true },
          { type: 'narrative', text: 'Before you can respond, another door opens.' }
        ],
        [
          { type: 'narrative', text: 'A girl steps out. Your age. Dark hair. Analytical eyes scanning everything.' },
          { type: 'narrative', text: 'She freezes when she sees you.' },
          { type: 'narrative', text: 'You freeze too.' },
          { type: 'narrative', text: 'Kira.', emphasis: true }
        ]
      ],
      'first-reunion': [
        [
          { type: 'dialogue-you', text: `"${gameState.playerName}?"` },
          { type: 'narrative', text: 'Kira\'s voice. But younger. Higher pitched.' },
          { type: 'narrative', text: 'She stares at you. You stare at her.' }
        ],
        [
          { type: 'narrative', text: 'The innkeeper looks between you both, confused.' },
          { type: 'dialogue-innkeeper', text: '"Do you two... know each other?"' },
          { type: 'narrative', text: 'Neither of you answer. You can\'t take your eyes off each other.' }
        ],
        [
          { type: 'narrative', text: 'Kira looks different—younger, obviously—but you\'d recognize those eyes anywhere.' },
          { type: 'narrative', text: 'Another door bursts open.' },
          { type: 'dialogue-maya', text: '"WHAT IS HAPPENING?!"' },
          { type: 'narrative', text: 'Maya.', emphasis: true }
        ]
      ],
      'second-reunion': [
        [
          { type: 'narrative', text: 'A girl with bright eyes and messy hair practically falls into the hallway.' },
          { type: 'narrative', text: 'She looks at you. At Kira. Her eyes go wide.' },
          { type: 'dialogue-maya', text: '"Oh my god. OH MY GOD. It\'s real. This is REAL."' }
        ],
        [
          { type: 'narrative', text: 'Maya rushes forward and grabs your shoulders.' },
          { type: 'dialogue-maya', text: '"You\'re REAL. You\'re here. We\'re ALL here!"' },
          { type: 'narrative', text: 'Her voice is shaking. She looks like she\'s about to cry or laugh or both.' }
        ],
        [
          { type: 'narrative', text: 'Kira walks over, movements careful and measured.' },
          { type: 'dialogue-kira', text: '"Everyone stay calm. We need to—"' },
          { type: 'narrative', text: 'The last door opens slowly.' }
        ]
      ],
      'third-reunion': [
        [
          { type: 'narrative', text: 'A boy steps out, rubbing his eyes. Messy hair. Calm expression despite the chaos.' },
          { type: 'narrative', text: 'Ethan.', emphasis: true },
          { type: 'dialogue-ethan', text: '"...hey."' }
        ],
        [
          { type: 'narrative', text: 'He looks at all of you. Takes in the situation.' },
          { type: 'dialogue-ethan', text: '"So uh. This is happening."' },
          { type: 'narrative', text: 'The innkeeper is completely lost now.' }
        ],
        [
          { type: 'dialogue-innkeeper', text: '"You... you all know each other? But you arrived separately, unconscious..."' },
          { type: 'narrative', text: 'The four of you stand in the hallway, staring at each other.' },
          { type: 'narrative', text: 'Different faces. Different bodies. But you know them.', emphasis: true }
        ]
      ],
      'group-panic': [
        [
          { type: 'narrative', text: 'You all crowd into your room. Door closed.' },
          { type: 'narrative', text: 'For a moment, nobody speaks.' },
          { type: 'narrative', text: 'Then everyone starts talking at once.' }
        ],
        [
          { type: 'dialogue-maya', text: '"We were playing the game and then—"' },
          { type: 'dialogue-kira', text: '"The white light, I felt—"' },
          { type: 'dialogue-ethan', text: '"Everything went white and—"' },
          { type: 'dialogue-you', text: '"The Discord call just—"' }
        ],
        [
          { type: 'narrative', text: 'Kira holds up a hand.' },
          { type: 'dialogue-kira', text: '"Stop. One at a time. Let\'s confirm what we know."' },
          { type: 'narrative', text: 'She takes a breath, forcing herself to be analytical.' }
        ],
        [
          { type: 'dialogue-kira', text: '"We were all in a Discord call. Playing the new DLC. We clicked START simultaneously."' },
          { type: 'dialogue-maya', text: '"And then everything went white!"' },
          { type: 'dialogue-ethan', text: '"I couldn\'t feel my body. Then nothing. Then I woke up here."' }
        ],
        [
          { type: 'narrative', text: 'You nod.' },
          { type: 'dialogue-you', text: '"Same. And now we\'re... here. Age 13 or 14. Different bodies."' },
          { type: 'dialogue-kira', text: '"In the novel world. The Astravelle Chronicles."' },
          { type: 'narrative', text: 'Silence.' },
          { type: 'dialogue-maya', text: '"We transmigrated. Like, actually transmigrated."' }
        ]
      ],
      'compare-bodies': [
        [
          { type: 'narrative', text: 'You all take turns looking in the mirror.' },
          { type: 'narrative', text: 'Different faces, but recognizable. Like your features were remixed into younger versions.' }
        ],
        [
          { type: 'dialogue-kira', text: '"Age regression to 13-14. That\'s the awakening age in the novel."' },
          { type: 'dialogue-maya', text: '"So we\'re supposed to... awaken powers?"' },
          { type: 'dialogue-ethan', text: '"If this follows the novel, yeah."' }
        ],
        [
          { type: 'narrative', text: 'Kira paces, thinking.' },
          { type: 'dialogue-kira', text: '"We all read the same novel. We know the plot. The bad ending. The Convergence cult. The Devourer of Boundaries."' }
        ],
        [
          { type: 'dialogue-maya', text: '"And we\'re here BEFORE all that happens, right?"' },
          { type: 'dialogue-you', text: '"The innkeeper said we\'ve been unconscious for three days. If the novel\'s timeline is accurate..."' },
          { type: 'dialogue-kira', text: '"We\'re at the very beginning. Before the academy year starts. Before the main events."' }
        ],
        [
          { type: 'narrative', text: 'Ethan sits on the bed.' },
          { type: 'dialogue-ethan', text: '"So we can change things. Stop the bad ending."' },
          { type: 'dialogue-maya', text: '"We can save everyone!"' },
          { type: 'narrative', text: 'Kira looks at the desk.' },
          { type: 'dialogue-kira', text: '"Wait. There\'s something on your desk. Letters?"' }
        ]
      ]
    };
    return pages[phase] || [];
  };

  const renderDialoguePage = (phase, buttonText, nextPhase) => {
    const pages = getDialoguePages(phase);
    const currentPage = pages[dialoguePage] || [];
    const hasMorePages = dialoguePage < pages.length - 1;

    return (
      <div className="scene dialogue-page-scene">
        <div className="book-container">
          <div className="book-page">
            {currentPage.map((line, i) => (
              <p 
                key={i} 
                className={`${line.type} page-line ${line.emphasis ? 'emphasis' : ''}`}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {line.text}
              </p>
            ))}
          </div>
          
          <div className="book-controls">
            {dialoguePage > 0 && (
              <button className="page-btn prev-btn" onClick={() => setDialoguePage(prev => prev - 1)}>
                ← Previous
              </button>
            )}
            <span className="page-number">Page {dialoguePage + 1} of {pages.length}</span>
            {hasMorePages ? (
              <button className="page-btn next-btn" onClick={() => setDialoguePage(prev => prev + 1)}>
                Next →
              </button>
            ) : (
              <button className="page-btn continue-btn" onClick={() => updateState({ chapter2Phase: nextPhase })}>
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get discord messages based on current state
  const getDiscordMessages = () => {
    const playerName = gameState.playerName || 'You';
    
    return [
      { user: 'Kira', text: 'Finally. Everyone here?', delay: 500 },
      { user: 'Maya', text: 'YOOO I\'VE BEEN WAITING', delay: 800 },
      { user: 'Ethan', text: 'hey', delay: 600 },
      { user: 'Kira', text: 'Ethan you\'re always so low energy lol', delay: 900 },
      { user: 'Maya', text: 'GUYS GUYS did you see the trailer??? It looks SICK', delay: 1000 },
      { user: 'Ethan', text: 'yeah the graphics are pretty clean', delay: 700 },
      { user: 'Kira', text: 'More importantly, did you all read the patch notes? They added that novel world as DLC.', delay: 1200 },
      { user: 'Maya', text: 'THE ASTRAVELLE CHRONICLES DLC RIGHT??? Based on that novel we all read!', delay: 1000 },
      { user: 'Ethan', text: 'wait the one with the cult ending? where everything gets destroyed?', delay: 900 },
      { user: 'Kira', text: 'That\'s the one. Apparently you can try to prevent the bad ending.', delay: 1100 },
      { user: 'Maya', text: 'omg we HAVE to try!! I wanna save everyone!!', delay: 800 },
      { user: 'Ethan', text: 'you say that but you\'re gonna rush in and die first', delay: 900 },
      { user: 'Maya', text: 'RUDE but true lol', delay: 600 },
      { user: 'Maya', text: 'wait @' + playerName + ' what do you think? can we actually save them?', delay: 1000 },
      { user: 'Kira', text: 'Good question. The novel had a LOT of character deaths.', delay: 900 },
      { user: 'Ethan', text: 'yeah like that whole arc with the traitor student', delay: 800 },
      { user: 'Maya', text: 'don\'t remind me I cried for like an hour', delay: 700 },
      { user: 'Kira', text: 'Same honestly. That was brutal.', delay: 800 },
      { user: 'Ethan', text: 'and the professor who got possessed', delay: 900 },
      { user: 'Maya', text: 'STOPPP', delay: 500 },
      { user: 'Kira', text: '@' + playerName + ' you\'ve been quiet. You ready?', delay: 1000 }
    ];
  };

  const getNovelDiscussion = () => {
    return [
      { user: 'Maya', text: 'okay downloading now!', delay: 600 },
      { user: 'Ethan', text: 'same', delay: 400 },
      { user: 'Kira', text: 'While we wait... refresher on the world?', delay: 800 },
      { user: 'Maya', text: 'OH OH I got this!', delay: 500 },
      { user: 'Maya', text: 'It\'s set in Astravelle Academy right?', delay: 700 },
      { user: 'Kira', text: 'Correct. Elite magic academy. Powers awaken at 13-14.', delay: 900 },
      { user: 'Ethan', text: 'everyone gets a power and a flaw', delay: 700 },
      { user: 'Maya', text: 'yeah like that Shadow Slave thing! every power has a curse!', delay: 800 },
      { user: 'Kira', text: 'Exactly. And there\'s a ranking system - S, A, B, C class.', delay: 1000 },
      { user: 'Ethan', text: 'C-class gets treated like trash basically', delay: 800 },
      { user: 'Maya', text: 'which is so SAD because some of them are actually cool', delay: 900 },
      { user: 'Kira', text: 'The protagonist starts C-class and climbs up. Classic underdog story.', delay: 1100 },
      { user: 'Maya', text: 'until the cult ruins everything', delay: 600 },
      { user: 'Ethan', text: 'yeah... The Convergence', delay: 700 },
      { user: 'Kira', text: 'They\'re the main antagonists. Trying to merge all realities.', delay: 1000 },
      { user: 'Maya', text: 'by summoning that THING', delay: 600 },
      { user: 'Ethan', text: 'The Devourer of Boundaries', delay: 800 },
      { user: 'Maya', text: 'worst name ever. sounds like an edgy OC', delay: 700 },
      { user: 'Kira', text: 'It\'s an eldritch entity that eats dimensions. The name fits.', delay: 1000 },
      { user: 'Ethan', text: 'in the novel it destroys like 90% of the world before dying', delay: 900 },
      { user: 'Maya', text: 'because everyone DIES before they can stop it properly', delay: 800 },
      { user: 'Kira', text: 'Preventable deaths. That\'s the key phrase here.', delay: 1000 },
      { user: 'Maya', text: 'if we can save those people, we can stop it early!', delay: 800 },
      { user: 'Ethan', text: 'big if', delay: 400 },
      { user: 'Maya', text: 'YOU\'RE SUCH A DOWNER', delay: 600 },
      { user: 'Ethan', text: 'just realistic lol', delay: 500 },
      { user: 'Kira', text: 'Game\'s finished downloading.', delay: 800 },
      { user: 'Maya', text: 'FINALLY', delay: 400 },
      { user: 'Ethan', text: 'launching now', delay: 600 }
    ];
  };

  // Render functions for each phase
  const renderOpening = () => (
    <div className="scene opening-scene">
      <div className="narrative">
        <p className="time">It's 11:47 PM on a Friday night.</p>
        <p>Your room is dark except for the monitor's glow. Empty coffee cup on your desk, cold and forgotten hours ago.</p>
        <p>You've been waiting for this all week.</p>
        <p className="small-pause">The new DLC drops tonight. The one based on <em>that</em> novel.</p>
        <p className="small-pause">You and your friends have been talking about it nonstop—theories, predictions, what you'd do differently if you were there.</p>
        <p className="small-pause">The story ended tragically in the book. World destroyed, most characters dead, humanity scattered.</p>
        <p className="small-pause">But the game promises something different: a chance to change fate.</p>
        <p className="emphasis">Your Discord notification chimes. The call is starting.</p>
      </div>
      <button className="continue-btn delayed-btn" onClick={() => updateState({ phase: 'discord' })}>
        Join Call
      </button>
    </div>
  );

  const renderDiscord = () => (
    <div className="scene discord-scene">
      <div className="desktop-bg">
        <div className="taskbar">
          <div className="taskbar-start">
            <div className="start-btn">🪟</div>
            <div className="taskbar-app active">
              <span className="app-icon">💬</span>
              Discord
            </div>
          </div>
          <div className="taskbar-time">11:47 PM</div>
        </div>

        <div className="discord-window">
          <div className="window-titlebar">
            <div className="window-title">
              <span className="discord-icon">💬</span>
              Discord
            </div>
            <div className="window-controls">
              <div className="window-btn">—</div>
              <div className="window-btn">□</div>
              <div className="window-btn close">✕</div>
            </div>
          </div>

          <div className="discord-content">
            <div className="discord-sidebar">
              <div className="server-icon active">AG</div>
              <div className="server-icon">GM</div>
              <div className="server-icon">FR</div>
            </div>

            <div className="discord-main">
              <div className="discord-header">
                <div className="channel-name">co-op-gaming</div>
                <div className="call-status">Voice Connected</div>
              </div>
              
              <div className="discord-messages" ref={messagesEndRef}>
                {gameState.chatMessages.map((msg, i) => (
                  <div key={i} className={`discord-msg ${msg.user.toLowerCase()}`}>
                    <div className="msg-avatar">{msg.user[0]}</div>
                    <div className="msg-content">
                      <div className="msg-user">{msg.user}</div>
                      <div className="msg-text">{msg.text}</div>
                    </div>
                  </div>
                ))}
                {gameState.someoneTyping && (
                  <div className="typing-indicator">
                    <div className="msg-avatar typing-avatar">{gameState.someoneTyping[0]}</div>
                    <div className="typing-content">
                      <div className="typing-user">{gameState.someoneTyping}</div>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {gameState.showInput && (
                <div className="choice-panel">
                  <p className="prompt">How do you respond?</p>
                  <div className="choice-buttons">
                    <button onClick={() => {
                      addChoice('firstResponse', 'confident');
                      // Add player's message to chat
                      setGameState(prev => ({
                        ...prev,
                        chatMessages: [...prev.chatMessages, { user: 'You', text: '"Yeah, let\'s do this."' }],
                        showInput: false,
                        discordPhase: 'charTalk'
                      }));
                      setCurrentMsgIndex(0);
                    }}>
                      "Yeah, let's do this."
                    </button>
                    <button onClick={() => {
                      addChoice('firstResponse', 'tired');
                      // Add player's message to chat
                      setGameState(prev => ({
                        ...prev,
                        chatMessages: [...prev.chatMessages, { user: 'You', text: '"Just tired, I\'m good."' }],
                        showInput: false,
                        discordPhase: 'charTalk'
                      }));
                      setCurrentMsgIndex(0);
                    }}>
                      "Just tired, I'm good."
                    </button>
                    <button onClick={() => {
                      addChoice('firstResponse', 'hyped');
                      // Add player's message to chat
                      setGameState(prev => ({
                        ...prev,
                        chatMessages: [...prev.chatMessages, { user: 'You', text: '"Actually pretty hyped for this."' }],
                        showInput: false,
                        discordPhase: 'charTalk'
                      }));
                      setCurrentMsgIndex(0);
                    }}>
                      "Actually pretty hyped for this."
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreation = () => {
    const step = !gameState.playerName ? 'name' : 
                !gameState.playerGender ? 'gender' : 
                !gameState.playerAlignment ? 'alignment' : 'loading';

    if (step === 'name') {
      return (
        <div className="scene creation-scene">
          <div className="creation-panel">
            <h2>CHARACTER CREATION</h2>
            <div className="creation-box">
              <label>ENTER CHARACTER NAME</label>
              <p className="hint">This will be your name in this world</p>
              <input 
                type="text" 
                maxLength={20}
                placeholder="Your name..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    updateState({ playerName: e.target.value.trim() });
                  }
                }}
              />
              <button onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  updateState({ playerName: input.value.trim() });
                }
              }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 'gender') {
      return (
        <div className="scene creation-scene">
          <div className="creation-panel">
            <h2>CHARACTER CREATION</h2>
            <div className="creation-box">
              <label>SELECT GENDER</label>
              <div className="gender-buttons">
                <button onClick={() => updateState({ playerGender: 'male' })}>
                  <span className="icon">⚔️</span>
                  MALE
                </button>
                <button onClick={() => updateState({ playerGender: 'female' })}>
                  <span className="icon">⚔️</span>
                  FEMALE
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step === 'alignment') {
      return (
        <div className="scene creation-scene">
          <div className="creation-panel">
            <h2>CHOOSE YOUR ALIGNMENT</h2>
            <p className="alignment-desc">This affects how you approach problems, dialogue options, and character relationships.</p>
            <div className="alignment-grid">
              <button onClick={() => updateState({ playerAlignment: 'lawful-good', phase: 'loading' })}>
                <span className="align-icon">⚖️</span>
                <span className="align-name">LAWFUL GOOD</span>
                <span className="align-desc">"Honor, justice, and order above all"</span>
              </button>
              <button onClick={() => updateState({ playerAlignment: 'neutral-good', phase: 'loading' })}>
                <span className="align-icon">⚖️</span>
                <span className="align-name">NEUTRAL GOOD</span>
                <span className="align-desc">"Do good, but be practical about it"</span>
              </button>
              <button onClick={() => updateState({ playerAlignment: 'chaotic-good', phase: 'loading' })}>
                <span className="align-icon">⚖️</span>
                <span className="align-name">CHAOTIC GOOD</span>
                <span className="align-desc">"Good intentions, unconventional methods"</span>
              </button>
              <button onClick={() => updateState({ playerAlignment: 'lawful-neutral', phase: 'loading' })}>
                <span className="align-icon">⚖️</span>
                <span className="align-name">LAWFUL NEUTRAL</span>
                <span className="align-desc">"Order and structure matter most"</span>
              </button>
              <button onClick={() => updateState({ playerAlignment: 'true-neutral', phase: 'loading' })}>
                <span className="align-icon">⚖️</span>
                <span className="align-name">TRUE NEUTRAL</span>
                <span className="align-desc">"Balance in all things"</span>
              </button>
              <button onClick={() => updateState({ playerAlignment: 'chaotic-neutral', phase: 'loading' })}>
                <span className="align-icon">⚖️</span>
                <span className="align-name">CHAOTIC NEUTRAL</span>
                <span className="align-desc">"Freedom and equality, by any means"</span>
              </button>
            </div>
            <p className="note">Evil alignments are unavailable</p>
          </div>
        </div>
      );
    }

    return renderLoading();
  };

  const renderLoading = () => (
    <div className="scene loading-scene">
      <div className="loading-content">
        <h2 className="loading-title">THE ASTRAVELLE CHRONICLES</h2>
        <div className="loading-bar">
          <div className={`loading-fill ${gameState.chatMessages.length >= getNovelDiscussion().length ? 'complete' : ''}`}></div>
        </div>
        <div className="loading-messages">
          {gameState.chatMessages.slice(-5).map((msg, i) => (
            msg && msg.user && msg.text ? (
              <div key={i} className="loading-msg">
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ) : null
          ))}
        </div>
      </div>
      
      {gameState.chatMessages.length >= getNovelDiscussion().length && (
        <div className="start-panel">
          <div className="start-box">
            <h3>START CO-OP SESSION</h3>
            <div className="players-ready">
              <div className="player-check">✓ {gameState.playerName}</div>
              <div className="player-check">✓ Kira_Tanaka</div>
              <div className="player-check">✓ Maya_Cross</div>
              <div className="player-check">✓ Ethan_Reed</div>
            </div>
            <button className="start-btn" onClick={() => updateState({ phase: 'transmigration' })}>
              START
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderTransmigration = () => (
    <div className="scene transmigration-scene">
      <div className="transmigration-content">
        <p className="glitch">The screen flashes white.</p>
        <p className="fade-in">Too bright.</p>
        <p className="fade-in delay-1">Your eyes hurt.</p>
        <p className="fade-in delay-2">The Discord voices start to distort—</p>
        <p className="distorted">"—guys? Anyone else—"</p>
        <p className="distorted">"—something's wrong—"</p>
        <p className="distorted">"—can't feel my—"</p>
        <p className="static">Static.</p>
        <p className="fade-in delay-3">Your head feels heavy.</p>
        <p className="fade-in delay-4">The white light is everywhere.</p>
        <p className="fade-in delay-5">Everything is white.</p>
        <p className="fade-in delay-6">Everything is nothing.</p>
        <div className="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
        <p className="final-line">Then darkness.</p>
      </div>
      <div className="chapter-end">
        <div className="end-ornament">✦</div>
        <h2>CHAPTER ONE</h2>
        <h3>THE CALL</h3>
        <div className="end-divider"></div>
        <div className="character-summary">
          <div className="summary-item">
            <span className="summary-label">Name</span>
            <span className="summary-value">{gameState.playerName}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Gender</span>
            <span className="summary-value">{gameState.playerGender}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Alignment</span>
            <span className="summary-value">{gameState.playerAlignment.replace('-', ' ')}</span>
          </div>
        </div>
        <div className="end-divider"></div>
        <p className="end-quote">"Four friends, one world, countless fates to change."</p>
        <button className="continue-btn" onClick={() => updateState({ phase: 'chapter2', chapter2Phase: 'blackness' })}>
          Continue to Chapter 2
        </button>
        <div className="end-ornament bottom">✦</div>
      </div>
    </div>
  );

  // ============================================
  // ============================================
  // CHAPTER 2 RENDER FUNCTIONS - CLEAN REBUILD
  // ============================================

  const renderChapter2 = () => {
    const { chapter2Phase } = gameState;
    
    if (chapter2Phase === 'blackness') return renderChapter2Blackness();
    if (chapter2Phase === 'stirring') return renderChapter2Stirring();
    if (chapter2Phase === 'awakening') return renderChapter2Awakening();
    if (chapter2Phase === 'room') return renderChapter2Room();
    if (chapter2Phase === 'panic') return renderChapter2Panic();
    if (chapter2Phase === 'door-knock') return renderChapter2DoorKnock();
    if (chapter2Phase === 'hallway') return renderChapter2Hallway();
    if (chapter2Phase === 'first-reunion') return renderChapter2FirstReunion();
    if (chapter2Phase === 'second-reunion') return renderChapter2SecondReunion();
    if (chapter2Phase === 'third-reunion') return renderChapter2ThirdReunion();
    if (chapter2Phase === 'group-panic') return renderChapter2GroupPanic();
    if (chapter2Phase === 'compare-bodies') return renderChapter2CompareBodies();
    if (chapter2Phase === 'letters') return renderChapter2Letters();
    if (chapter2Phase === 'discussion') return renderChapter2Discussion();
    if (chapter2Phase === 'plan') return renderChapter2Plan();
    if (chapter2Phase === 'preparation') return renderChapter2Preparation();
    
    return null;
  };

  // Blackness scene
  const renderChapter2Blackness = () => (
    <div className="scene blackness-scene">
      <div className="blackness-content">
        <p className="fade-slow">.</p>
        <p className="fade-slow delay-1">.</p>
        <p className="fade-slow delay-2">.</p>
        <p className="text-appear">Darkness.</p>
        <p className="text-appear delay-1">Silence.</p>
        <p className="text-appear delay-2">Nothingness.</p>
        <p className="text-appear delay-3">Then... something.</p>
      </div>
      <button className="fade-btn-ch2" onClick={() => updateState({ chapter2Phase: 'stirring' })}>
        ···
      </button>
    </div>
  );

  // Stirring scene
  const renderChapter2Stirring = () => (
    <div className="scene awakening-scene">
      <div className="awakening-content">
        <p>A sound. Distant. Muffled.</p>
        <p className="pause">Your consciousness stirs.</p>
        <p className="pause">You feel <em>wrong</em>. Everything feels wrong.</p>
        <p className="pause">The surface beneath you is too firm.</p>
        <p className="pause">The air smells different—wood smoke, something floral, dust.</p>
        <p className="pause">Your body feels lighter. Smaller. Unfamiliar.</p>
        <p className="pause">Memories trickle back slowly.</p>
        <p className="pause emphasis">The game. Your friends. The white light.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'awakening' })}>
          Wake up
        </button>
      </div>
    </div>
  );

  // Awakening scene
  const renderChapter2Awakening = () => (
    <div className="scene awakening-scene">
      <div className="awakening-content">
        <p>Your eyes open slowly.</p>
        <p className="pause">Wooden ceiling. Rough beams. No electric lights.</p>
        <p className="pause">This isn't your bedroom.</p>
        <p className="pause">You sit up—and immediately notice something's <strong>wrong</strong>.</p>
        <p className="pause">Your hands. They're <em>smaller</em>.</p>
        <p className="pause">You look down at yourself. Your whole body is different. Younger. Lighter.</p>
        <p className="pause">The clothes you fell asleep in are gone. You're wearing simple linen clothing now.</p>
        <p className="pause emphasis">Where the hell are you?</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'room' })}>
          Look around
        </button>
      </div>
    </div>
  );

  // Room exploration
  const renderChapter2Room = () => (
    <div className="scene room-scene">
      <div className="room-description">
        <h3>Unknown Room - Early Morning</h3>
        <p>You're in a small inn room. Medieval aesthetic—wooden furniture, a simple bed, a window with no glass (just shutters). Morning light streams in.</p>
        <p>There's a desk with something on it. A mirror on the wall. A chair with folded clothes.</p>
        <p>No phone. No laptop. No modern technology anywhere.</p>
        <p className="emphasis">This can't be real. This <em>can't</em> be real.</p>
      </div>

      <div className="examine-grid">
        <div className={`examine-item ${gameState.examined.includes('mirror') ? 'examined' : ''}`}
             onClick={() => examine('mirror')}>
          <span className="examine-icon">🪞</span>
          <span className="examine-label">Look in the mirror</span>
          {gameState.examined.includes('mirror') && (
            <div className="examine-result">
              <p>You walk to the mirror.</p>
              <p>The face staring back is <em>yours</em>—but younger. Much younger.</p>
              <p>Age 13. Maybe 14 at most.</p>
              <p>Same eyes. Same basic features. But this body is... different.</p>
              <p><strong>You're {gameState.playerName}. And you're not in your world anymore.</strong></p>
            </div>
          )}
        </div>

        <div className={`examine-item ${gameState.examined.includes('window') ? 'examined' : ''}`}
             onClick={() => examine('window')}>
          <span className="examine-icon">🪟</span>
          <span className="examine-label">Look out the window</span>
          {gameState.examined.includes('window') && (
            <div className="examine-result">
              <p>A medieval town square. Cobblestone streets. People in fantasy clothing.</p>
              <p>Horse-drawn carts. Market stalls. No cars. No power lines. No modern anything.</p>
              <p>This is <strong>real</strong>. This is <em>actually happening</em>.</p>
            </div>
          )}
        </div>

        <div className={`examine-item ${gameState.examined.includes('desk') ? 'examined' : ''}`}
             onClick={() => examine('desk')}>
          <span className="examine-icon">📝</span>
          <span className="examine-label">Check the desk</span>
          {gameState.examined.includes('desk') && (
            <div className="examine-result">
              <p>A sealed letter with elegant handwriting.</p>
              <p>A small pouch that jingles—coins, probably.</p>
              <p>A simple map.</p>
              <p>Someone left these here. For you?</p>
            </div>
          )}
        </div>

        <div className={`examine-item ${gameState.examined.includes('hands') ? 'examined' : ''}`}
             onClick={() => examine('hands')}>
          <span className="examine-icon">🖐️</span>
          <span className="examine-label">Examine your hands</span>
          {gameState.examined.includes('hands') && (
            <div className="examine-result">
              <p>Smaller. Younger. The calluses from your keyboard are gone.</p>
              <p>These are the hands of a 13-year-old.</p>
              <p>Your body has been <em>reset</em>.</p>
            </div>
          )}
        </div>
      </div>

      {gameState.examined.length >= 3 && (
        <div className="action-buttons" style={{marginTop: '40px'}}>
          <button onClick={() => updateState({ chapter2Phase: 'panic' })}>
            Try to process this
          </button>
        </div>
      )}
    </div>
  );

  // Panic/reaction scene
  const renderChapter2Panic = () => {
    const alignmentResponses = {
      'lawful-good': [
        { text: "Stay calm. Think this through logically.", value: 'calm' },
        { text: "I need to find the others. We stick together.", value: 'others' }
      ],
      'neutral-good': [
        { text: "Okay. This is happening. I need to adapt.", value: 'adapt' },
        { text: "Find my friends first. Figure out the rest later.", value: 'friends' }
      ],
      'chaotic-good': [
        { text: "This is insane. Also kind of exciting?", value: 'excited' },
        { text: "No point panicking. Let's figure this out.", value: 'figure' }
      ],
      'lawful-neutral': [
        { text: "Information first. Panic later.", value: 'info' },
        { text: "I need to understand the rules of this place.", value: 'rules' }
      ],
      'true-neutral': [
        { text: "Accept it. This is reality now.", value: 'accept' },
        { text: "Survive first. Understand later.", value: 'survive' }
      ],
      'chaotic-neutral': [
        { text: "Well, I'm here. Might as well roll with it.", value: 'roll' },
        { text: "The old rules don't apply anymore.", value: 'new-rules' }
      ]
    };

    const responses = alignmentResponses[gameState.playerAlignment] || alignmentResponses['true-neutral'];

    return (
      <div className="scene panic-scene">
        <div className="panic-content">
          <h3>Reality Check</h3>
          <p>You're in a fantasy world.</p>
          <p>You're 13 years old.</p>
          <p>Your friends... are they here too?</p>
          <p>The game. The co-op session. The white light.</p>
          <p>You <em>transmigrated</em>. Into the novel world.</p>
          <p>The world where a cult summons an eldritch entity and destroys everything.</p>
          <p className="emphasis">How do you react?</p>
        </div>
        <div className="choice-panel-ch2">
          {responses.map((response, i) => (
            <button key={i} onClick={() => {
              addChoice('panicResponse', response.value);
              updateState({ chapter2Phase: 'door-knock' });
            }}>
              {response.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Door knock scene
  const renderChapter2DoorKnock = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <p className="narrative">Before you can spiral further, you hear it.</p>
        <p className="narrative emphasis">A knock. On a door. Nearby.</p>
        <p className="narrative">Then a voice—older woman, kind but concerned:</p>
        <p className="dialogue-line dialogue-innkeeper">"Hello? Are you awake in there? You've been asleep for over a day..."</p>
        <p className="narrative">A pause. Then the voice again, from a different door.</p>
        <p className="dialogue-line dialogue-innkeeper">"Young one? Can you hear me?"</p>
        <p className="narrative">Multiple rooms. Multiple people.</p>
        <p className="narrative emphasis">Your friends?</p>
        <p className="narrative">You hear footsteps in the hallway. Muffled voices. Someone else is awake.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'hallway' })}>
          Open your door
        </button>
      </div>
    </div>
  );

  // All reunion scenes - simple clean format
  const renderChapter2Hallway = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <p className="narrative">You open the door carefully.</p>
        <p className="narrative">A narrow inn hallway. Wooden floors. Several doors, all identical.</p>
        <p className="narrative">An older woman in simple clothing stands in the hall—the innkeeper, probably. She looks relieved to see you.</p>
        <p className="dialogue-line dialogue-innkeeper">"Oh good, you're awake! I was starting to worry. Four of you arrived three days ago, all unconscious. The doctor said you'd wake when you were ready, but still..."</p>
        <p className="narrative emphasis">Four of you.</p>
        <p className="narrative">Before you can respond, another door opens.</p>
        <p className="narrative">A girl steps out. Your age. Dark hair. Analytical eyes scanning everything.</p>
        <p className="narrative">She freezes when she sees you.</p>
        <p className="narrative">You freeze too.</p>
        <p className="narrative emphasis">Kira.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'first-reunion' })}>
          "...Kira?"
        </button>
      </div>
    </div>
  );

  const renderChapter2FirstReunion = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <p className="dialogue-line dialogue-kira">"{gameState.playerName}?"</p>
        <p className="narrative">Kira's voice. But younger. Higher pitched.</p>
        <p className="narrative">She stares at you. You stare at her.</p>
        <p className="narrative">The innkeeper looks between you both, confused.</p>
        <p className="dialogue-line dialogue-innkeeper">"Do you two... know each other?"</p>
        <p className="narrative">Neither of you answer. You can't take your eyes off each other.</p>
        <p className="narrative">Kira looks different—younger, obviously—but you'd recognize those eyes anywhere.</p>
        <p className="narrative">Another door bursts open.</p>
        <p className="dialogue-line dialogue-maya">"WHAT IS HAPPENING?!"</p>
        <p className="narrative">A girl with bright eyes and messy hair practically falls into the hallway.</p>
        <p className="narrative emphasis">Maya.</p>
        <p className="narrative">She looks at you. At Kira. Her eyes go wide.</p>
        <p className="dialogue-line dialogue-maya">"Oh my god. OH MY GOD. It's real. This is REAL."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'second-reunion' })}>
          "Maya?!"
        </button>
      </div>
    </div>
  );

  const renderChapter2SecondReunion = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <p className="narrative">Maya rushes forward and grabs your shoulders.</p>
        <p className="dialogue-line dialogue-maya">"You're REAL. You're here. We're ALL here!"</p>
        <p className="narrative">Her voice is shaking. She looks like she's about to cry or laugh or both.</p>
        <p className="narrative">Kira walks over, movements careful and measured.</p>
        <p className="dialogue-line dialogue-kira">"Everyone stay calm. We need to—"</p>
        <p className="narrative">The last door opens slowly.</p>
        <p className="narrative">A boy steps out, rubbing his eyes. Messy hair. Calm expression despite the chaos.</p>
        <p className="narrative emphasis">Ethan.</p>
        <p className="dialogue-line dialogue-ethan">"...hey."</p>
        <p className="narrative">He looks at all of you. Takes in the situation.</p>
        <p className="dialogue-line dialogue-ethan">"So uh. This is happening."</p>
        <p className="narrative">The innkeeper is completely lost now.</p>
        <p className="dialogue-line dialogue-innkeeper">"You... you all know each other? But you arrived separately, unconscious..."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'third-reunion' })}>
          All four of you
        </button>
      </div>
    </div>
  );

  const renderChapter2ThirdReunion = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <p className="narrative">The four of you stand in the hallway, staring at each other.</p>
        <p className="narrative">Different faces. Different bodies. But you <em>know</em> them.</p>
        <p className="narrative">Kira's analytical gaze. Maya's barely-contained energy. Ethan's calm presence.</p>
        <p className="narrative">This is real. This is actually real.</p>
        <p className="dialogue-line dialogue-kira">"We need to talk. Privately."</p>
        <p className="narrative">She turns to the innkeeper with a polite smile.</p>
        <p className="dialogue-line dialogue-kira">"Thank you for your care. May we use one of the rooms to... catch up?"</p>
        <p className="narrative">The innkeeper nods, still confused but kind.</p>
        <p className="dialogue-line dialogue-innkeeper">"Of course, dears. I'll bring up some breakfast. You must be starving."</p>
        <p className="narrative">Once she leaves, Maya grabs all of you.</p>
        <p className="dialogue-line dialogue-maya">"Okay. OKAY. What the HELL just happened?!"</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'group-panic' })}>
          Emergency meeting
        </button>
      </div>
    </div>
  );

  const renderChapter2GroupPanic = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <p className="narrative">You all crowd into your room. Door closed.</p>
        <p className="narrative">For a moment, nobody speaks.</p>
        <p className="narrative">Then everyone starts talking at once.</p>
        <p className="dialogue-line dialogue-maya">"We were playing the game and then—"</p>
        <p className="dialogue-line dialogue-kira">"The white light, I felt—"</p>
        <p className="dialogue-line dialogue-ethan">"Everything went white and—"</p>
        <p className="dialogue-line dialogue-you">"The Discord call just—"</p>
        <p className="narrative">Kira holds up a hand.</p>
        <p className="dialogue-line dialogue-kira">"Stop. One at a time. Let's confirm what we know."</p>
        <p className="narrative">She takes a breath, forcing herself to be analytical.</p>
        <p className="dialogue-line dialogue-kira">"We were all in a Discord call. Playing the new DLC. We clicked START simultaneously."</p>
        <p className="dialogue-line dialogue-maya">"And then everything went white!"</p>
        <p className="dialogue-line dialogue-ethan">"I couldn't feel my body. Then nothing. Then I woke up here."</p>
        <p className="narrative">You nod.</p>
        <p className="dialogue-line dialogue-you">"Same. And now we're... here. Age 13 or 14. Different bodies."</p>
        <p className="dialogue-line dialogue-kira">"In the novel world. The Astravelle Chronicles."</p>
        <p className="narrative">Silence.</p>
        <p className="dialogue-line dialogue-maya">"We transmigrated. Like, actually transmigrated."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'compare-bodies' })}>
          "We need to check something"
        </button>
      </div>
    </div>
  );

  const renderChapter2CompareBodies = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <p className="narrative">You all take turns looking in the mirror.</p>
        <p className="narrative">Different faces, but recognizable. Like your features were remixed into younger versions.</p>
        <p className="dialogue-line dialogue-kira">"Age regression to 13-14. That's the awakening age in the novel."</p>
        <p className="dialogue-line dialogue-maya">"So we're supposed to... awaken powers?"</p>
        <p className="dialogue-line dialogue-ethan">"If this follows the novel, yeah."</p>
        <p className="narrative">Kira paces, thinking.</p>
        <p className="dialogue-line dialogue-kira">"We all read the same novel. We know the plot. The bad ending. The Convergence cult. The Devourer of Boundaries."</p>
        <p className="dialogue-line dialogue-maya">"And we're here BEFORE all that happens, right?"</p>
        <p className="dialogue-line dialogue-you">"The innkeeper said we've been unconscious for three days. If the novel's timeline is accurate..."</p>
        <p className="dialogue-line dialogue-kira">"We're at the very beginning. Before the academy year starts. Before the main events."</p>
        <p className="narrative">Ethan sits on the bed.</p>
        <p className="dialogue-line dialogue-ethan">"So we can change things. Stop the bad ending."</p>
        <p className="dialogue-line dialogue-maya">"We can save everyone!"</p>
        <p className="narrative">Kira looks at the desk.</p>
        <p className="dialogue-line dialogue-kira">"Wait. There's something on your desk. Letters?"</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'letters' })}>
          Check the letters
        </button>
      </div>
    </div>
  );

  const renderChapter2Letters = () => (
    <div className="scene letter-scene">
      <div className="letter-content">
        <p className="narrative">You all have identical letters.</p>
        <p className="narrative">Kira opens hers first and starts reading aloud.</p>
        <div className="letter-paper">
          <p className="letter-header">To the Newly Awakened,</p>
          <p className="letter-body">
            Congratulations on your awakening. Your potential has been recognized, and you have been granted admission to <strong>Astravelle Academy for Awakened Arts</strong>.
          </p>
          <p className="letter-body">
            Report to the academy within three days of receiving this letter. Transportation arrangements have been made from the town of Millhaven.
          </p>
          <p className="letter-body">
            The enclosed funds should suffice for your journey. A map is included.
          </p>
          <p className="letter-body">
            May your path be illuminated by starlight.
          </p>
          <p className="letter-signature">— Headmistress Celestia Astraven</p>
          <p className="letter-date"><em>Date: Three months ago</em></p>
        </div>
        <p className="narrative">Maya looks up, pale.</p>
        <p className="dialogue-line dialogue-maya">"Three months ago."</p>
        <p className="dialogue-line dialogue-ethan">"Before we even bought the game."</p>
        <p className="dialogue-line dialogue-kira">"Before we even KNEW about the DLC."</p>
        <p className="dialogue-line dialogue-you">"These were sent before we transmigrated. Someone knew we'd be here."</p>
        <p className="narrative">The weight of that settles over all of you.</p>
        <p className="dialogue-line dialogue-kira">"But... the headmistress couldn't have known we're transmigrators. This just looks like a standard acceptance letter."</p>
        <p className="dialogue-line dialogue-ethan">"The date though. That's weird."</p>
        <p className="dialogue-line dialogue-maya">"Maybe time works differently? Or maybe... someone ELSE arranged this?"</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'discussion' })}>
          "What do we do?"
        </button>
      </div>
    </div>
  );

  const renderChapter2Discussion = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <h3 className="section-title">The Situation</h3>
        <p className="dialogue-line dialogue-kira">"Let's think through this logically."</p>
        <p className="narrative">Kira counts on her fingers.</p>
        <p className="dialogue-line dialogue-kira">"One: We're in the novel world. Two: We're 13-14 years old. Three: We have three days to reach the academy. Four: Someone sent us admission letters three months BEFORE we transmigrated."</p>
        <p className="dialogue-line dialogue-maya">"And five: The world is going to end if we don't stop it."</p>
        <p className="dialogue-line dialogue-ethan">"No pressure or anything."</p>
        <p className="narrative">You speak up.</p>
        <p className="dialogue-line dialogue-you">"We have advantages. We know the plot. We know who the villains are. We know what's coming."</p>
        <p className="dialogue-line dialogue-kira">"But we also have disadvantages. We're weak. We're kids. We don't have powers yet."</p>
        <p className="dialogue-line dialogue-maya">"YET. We'll get powers, right? When we awaken?"</p>
        <p className="dialogue-line dialogue-ethan">"If we follow the novel's rules, yeah. Everyone awakens at this age."</p>
        <p className="dialogue-line dialogue-kira">"The letters are a mystery. The headmistress couldn't have known we're transmigrators—the letter reads like a normal acceptance. But the date..."</p>
        <p className="dialogue-line dialogue-you">"Someone or something arranged our arrival. We need to be careful."</p>
        <p className="narrative">Kira looks at all of you.</p>
        <p className="dialogue-line dialogue-kira">"So here's what we do. We go to the academy. We train. We get stronger. We use our knowledge to prevent the key deaths that lead to the bad ending."</p>
        <p className="dialogue-line dialogue-you">"And we stick together. All four of us."</p>
        <p className="dialogue-line dialogue-maya">"Obviously! We're a party!"</p>
        <p className="narrative">Ethan nods.</p>
        <p className="dialogue-line dialogue-ethan">"First step: Get to the academy. Second step: Don't die."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'plan' })}>
          Make a plan
        </button>
      </div>
    </div>
  );

  const renderChapter2Plan = () => (
    <div className="scene simple-dialogue-scene">
      <div className="dialogue-box">
        <h3 className="section-title">The Plan</h3>
        <p className="dialogue-line dialogue-kira">"Three days to reach the academy. The letter says transportation is arranged from Millhaven."</p>
        <p className="dialogue-line dialogue-maya">"That's... this town, right? The innkeeper mentioned it."</p>
        <p className="dialogue-line dialogue-ethan">"So someone local will take us there."</p>
        <p className="dialogue-line dialogue-you">"The question is: who arranged all this?"</p>
        <p className="dialogue-line dialogue-kira">"We don't know if the headmistress is aware we're transmigrators. The letter could be legitimate—we're the right age, we've 'awakened' according to this world's logic."</p>
        <p className="dialogue-line dialogue-maya">"But the date! Three months before we transmigrated!"</p>
        <p className="dialogue-line dialogue-ethan">"Time magic? Precognition? Or maybe whoever brought us here set everything up in advance."</p>
        <p className="narrative">You all look at each other.</p>
        <p className="narrative">Four friends from different parts of the world.</p>
        <p className="narrative">Brought together by a game.</p>
        <p className="narrative">Now in a world that needs saving.</p>
        <p className="dialogue-line dialogue-you">"We'll figure out the mystery later. For now, we focus on survival and getting stronger."</p>
        <p className="dialogue-line dialogue-kira">"Agreed. Trust no one except each other."</p>
        <p className="dialogue-line dialogue-maya">"Hell yeah! Team Transmigrator!"</p>
        <p className="dialogue-line dialogue-ethan">"...please don't call us that out loud."</p>
        <p className="dialogue-line dialogue-maya">"Fine, fine. But we're still a team!"</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter2Phase: 'preparation' })}>
          Prepare to leave
        </button>
      </div>
    </div>
  );

  const renderChapter2Preparation = () => (
    <div className="scene preparation-scene">
      <div className="prep-content">
        <h3>New Determination</h3>
        <p>The innkeeper brings food. You all eat together, talking quietly.</p>
        <p>You have three days to reach Astravelle Academy.</p>
        <p>You have knowledge of future events.</p>
        <p>You have each other.</p>
        <p>The novel's bad ending showed a world destroyed by the Devourer of Boundaries.</p>
        <p>Countless deaths. The Convergence cult succeeding.</p>
        <p>But you're here now. Before it all begins.</p>
        <p className="emphasis">You can change fate.</p>
        <p className="emphasis">You WILL change fate.</p>
      </div>
      
      {/* Chapter end card as popup overlay */}
      <div className="chapter-end-overlay">
        <div className="chapter-end-card">
          <div className="end-ornament">✦</div>
          <h2>CHAPTER TWO</h2>
          <h3>REUNION</h3>
          <div className="end-divider"></div>
          <div className="character-summary">
            <div className="summary-row">
              <span className="summary-name">{gameState.playerName}</span>
              <span className="summary-role">Leader</span>
            </div>
            <div className="summary-row">
              <span className="summary-name">Kira Tanaka</span>
              <span className="summary-role">Tactician</span>
            </div>
            <div className="summary-row">
              <span className="summary-name">Maya Cross</span>
              <span className="summary-role">Heart</span>
            </div>
            <div className="summary-row">
              <span className="summary-name">Ethan Reed</span>
              <span className="summary-role">Anchor</span>
            </div>
          </div>
          <div className="end-divider"></div>
          <p className="end-quote">"Four friends. One world. Infinite possibilities."</p>
          <button className="continue-btn" onClick={() => updateState({ phase: 'chapter3' })}>
            Continue to Chapter 3
          </button>
          <div className="end-ornament bottom">✦</div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // CHAPTER 3 RENDER FUNCTIONS - THE JOURNEY
  // ============================================

  const renderChapter3 = () => {
    const { chapter3Phase } = gameState;

    if (chapter3Phase === 'departure') return renderChapter3Departure();
    if (chapter3Phase === 'town-square') return renderChapter3TownSquare();
    if (chapter3Phase === 'caravan') return renderChapter3Caravan();
    if (chapter3Phase === 'travelers') return renderChapter3Travelers();
    if (chapter3Phase === 'camp1') return renderChapter3Camp1();
    if (chapter3Phase === 'discovery') return renderChapter3Discovery();
    if (chapter3Phase === 'encounter') return renderChapter3Encounter();
    if (chapter3Phase === 'camp2') return renderChapter3Camp2();
    if (chapter3Phase === 'approach') return renderChapter3Approach();
    if (chapter3Phase === 'gates') return renderChapter3Gates();
    if (chapter3Phase === 'sorting') return renderChapter3Sorting();
    if (chapter3Phase === 'dorms') return renderChapter3Dorms();
    if (chapter3Phase === 'end') return renderChapter3End();

    return null;
  };

  const renderChapter3Departure = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h2 className="chapter-title">Chapter Three: The Journey</h2>
        <p className="narrative">Morning light streams through the inn windows.</p>
        <p className="narrative">You're all packed—what little you have, anyway. The letters, the coins, simple traveling clothes the innkeeper provided.</p>
        <p className="narrative">The innkeeper meets you at the front desk.</p>
        <p className="dialogue-innkeeper">"Heading to the academy, then? Good timing. There's a caravan leaving from the town square in an hour. They're heading that way."</p>
        <p className="narrative">She hands you each a small wrapped bundle.</p>
        <p className="dialogue-innkeeper">"Travel food. It's a three-day journey. Be safe, young ones."</p>
        <p className="dialogue-maya">"Thank you!"</p>
        <p className="narrative">Maya's genuine gratitude makes the innkeeper smile.</p>
        <p className="dialogue-innkeeper">"You're welcome, dear. The world needs more young people with good hearts."</p>
        <p className="narrative">If only she knew what was coming.</p>
        <p className="dialogue-kira">"We should go. Don't want to miss the caravan."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'town-square' })}>
          Head to town square
        </button>
      </div>
    </div>
  );

  const renderChapter3TownSquare = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Millhaven Town Square - Morning</h3>
        <p className="narrative">The town square is already bustling.</p>
        <p className="narrative">Medieval fantasy in full display: Market stalls, people in varied clothing, some carrying visible weapons.</p>
        <p className="narrative">And then you see it.</p>
        <p className="narrative emphasis">Magic.</p>
        <p className="narrative">A merchant conjures flame in his palm to light a brazier. A woman lifts crates with telekinesis. A child creates water from thin air to fill a bucket.</p>
        <p className="narrative">Casual. Natural. Normal for them.</p>
        <p className="dialogue-ethan">"...this is really happening."</p>
        <p className="dialogue-maya">"I know we KNEW, but seeing it..."</p>
        <p className="dialogue-kira">"Stay focused. There's the caravan."</p>
        <p className="narrative">A line of wagons near the edge of the square. Several people—mostly young, your age—gathered around them.</p>
        <p className="narrative">Other academy students, probably.</p>
        <p className="dialogue-you">"Let's go."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'caravan' })}>
          Approach the caravan
        </button>
      </div>
    </div>
  );

  const renderChapter3Caravan = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">The Caravan</h3>
        <p className="narrative">A grizzled merchant oversees the loading.</p>
        <p className="dialogue-npc">"Academy letters?"</p>
        <p className="narrative">You all show your letters. He nods.</p>
        <p className="dialogue-npc">"Good. Wagon three. We leave in ten minutes. Don't wander off."</p>
        <p className="narrative">Efficient. No-nonsense. You like that.</p>
        <p className="narrative">Around you, other students are gathering. You count maybe eight others. All around your age, all with that same nervous energy.</p>
        <p className="narrative">First-years. Awakened. Heading to their futures.</p>
        <p className="narrative">Except you four know what's really waiting.</p>
        <p className="dialogue-kira">"Stay together. We don't know these people yet."</p>
        <p className="dialogue-maya">"Do you think any of them are... you know. Cult members?"</p>
        <p className="dialogue-ethan">"Too early to tell. We'll need to be careful."</p>
        <p className="narrative">The merchant shouts.</p>
        <p className="dialogue-npc">"Load up! We're moving!"</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'travelers' })}>
          Board the wagon
        </button>
      </div>
    </div>
  );

  const renderChapter3Travelers = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Day 1 - On the Road</h3>
        <p className="narrative">The wagon rolls forward. The town of Millhaven fades behind you.</p>
        <p className="narrative">You're in a wagon with six others. Native students.</p>
        <p className="narrative">A tall boy with confident eyes. A quiet girl with a book. Twin brothers who won't stop talking. A nervous-looking kid who keeps fidgeting. A girl with striking red hair who watches everyone.</p>
        <p className="narrative">The tall boy speaks first.</p>
        <p className="dialogue-npc">"First year, right? What tier did you awaken?"</p>
        <p className="narrative">He's asking you. All four of you.</p>
        <p className="dialogue-kira">"Common tier."</p>
        <p className="narrative">Kira answers smoothly. No hesitation.</p>
        <p className="narrative">The boy's expression shifts. Not quite dismissive, but... less interested.</p>
        <p className="dialogue-npc">"Ah. Well, everyone starts somewhere. I'm Rare tier. Fire manipulation."</p>
        <p className="narrative">He says it casually, but there's pride there.</p>
        <p className="narrative">The twins exchange looks.</p>
        <p className="dialogue-npc">"We're Uncommon. Wind affinity."</p>
        <p className="narrative">The red-haired girl doesn't volunteer her tier. Interesting.</p>
        <p className="narrative">Maya leans close to you and whispers.</p>
        <p className="dialogue-maya">"They have no idea, do they?"</p>
        <p className="narrative">No. They don't.</p>
        <p className="narrative">They see four Common-tier kids. Weak. Unremarkable.</p>
        <p className="narrative">They have no idea what's really in this wagon with them.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'camp1' })}>
          Continue journey
        </button>
      </div>
    </div>
  );

  const renderChapter3Camp1 = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Camp - First Night</h3>
        <p className="narrative">The caravan stops at sunset. A clearing by the road. Tents go up quickly.</p>
        <p className="narrative">The native students cluster together, chatting easily. You four find a spot away from them.</p>
        <p className="narrative">Kira spreads out a map.</p>
        <p className="dialogue-kira">"Two more days to the academy. We need to talk about what happens when we get there."</p>
        <p className="dialogue-ethan">"We'll be tested. Power evaluation. They'll put us in classes based on perceived strength."</p>
        <p className="dialogue-maya">"And we're claiming Common tier. Which means..."</p>
        <p className="dialogue-you">"C-Class. Bottom of the barrel."</p>
        <p className="narrative">Silence for a moment.</p>
        <p className="dialogue-kira">"It's the smart play. We can't reveal our real abilities yet. Not until we understand the threats."</p>
        <p className="dialogue-ethan">"The Convergence cult. They have infiltrators in the academy."</p>
        <p className="dialogue-maya">"So we stay weak. Stay beneath notice. Learn the layout. Figure out who to trust."</p>
        <p className="narrative">You look at your hands. Thirteen years old. Strange body. Strange world.</p>
        <p className="narrative">And somewhere inside you, foreign power waiting to manifest.</p>
        <p className="dialogue-you">"Do we even know if our powers work yet?"</p>
        <p className="narrative">Kira shakes her head.</p>
        <p className="dialogue-kira">"Not tested. We haven't had a chance."</p>
        <p className="dialogue-ethan">"Probably better that way. If we accidentally use them here..."</p>
        <p className="narrative">He trails off. The implication clear.</p>
        <p className="narrative">Revealing yourselves too early could be fatal.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'discovery', day: 2 })}>
          Next day
        </button>
      </div>
    </div>
  );

  const renderChapter3Discovery = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Day 2 - The Accident</h3>
        <p className="narrative">Morning. The wagons roll on.</p>
        <p className="narrative">You're dozing when Maya gasps.</p>
        <p className="dialogue-maya">"Oh no. No no no—"</p>
        <p className="narrative">Her hands are trembling. The air around them shimmer.</p>
        <p className="narrative emphasis">Vectors. You can almost see them. Lines of force, direction, magnitude.</p>
        <p className="narrative">A water skin near her hand suddenly jerks sideways—perfectly reversed trajectory.</p>
        <p className="narrative">Kira reacts instantly, grabbing Maya's wrists.</p>
        <p className="dialogue-kira">"Breathe. Focus. Pull it back."</p>
        <p className="narrative">The shimmer fades. Maya's breathing hard.</p>
        <p className="dialogue-maya">"I didn't mean to. I was just thinking about vectors and then—"</p>
        <p className="narrative">The native students are staring.</p>
        <p className="dialogue-npc">"What was that?"</p>
        <p className="dialogue-you">"Nothing. She's just nervous about the academy."</p>
        <p className="narrative">The fire-user narrows his eyes but says nothing.</p>
        <p className="narrative">Later, when you're alone again, Ethan speaks quietly.</p>
        <p className="dialogue-ethan">"So it's real. The powers are here. They work."</p>
        <p className="dialogue-kira">"Which means we need to be more careful. No manifesting. Not until we're safely in the academy."</p>
        <p className="narrative">Maya nods, still shaken.</p>
        <p className="dialogue-maya">"I felt it. The vectors. Everything has direction, momentum, force. I could... change them."</p>
        <p className="narrative">Her voice drops to a whisper.</p>
        <p className="dialogue-maya">"It was terrifying."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'encounter' })}>
          Continue
        </button>
      </div>
    </div>
  );

  const renderChapter3Encounter = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Day 2 - Afternoon Encounter</h3>
        <p className="narrative">The caravan stops abruptly.</p>
        <p className="narrative">Shouts from the front. The merchant's voice, urgent.</p>
        <p className="dialogue-npc">"Shadow beast! Students, form up!"</p>
        <p className="narrative">Everyone scrambles out of the wagons. You see it.</p>
        <p className="narrative">A creature. Wolf-like, but wrong. Made of darkness and malice. Red eyes burning.</p>
        <p className="narrative">The fire-user steps forward, flames already dancing in his palms.</p>
        <p className="dialogue-npc">"Rare tier, coming through!"</p>
        <p className="narrative">He launches a fireball. The beast dodges—impossibly fast.</p>
        <p className="narrative">The twins move in sync, wind blades cutting through the air. One connects, drawing black blood.</p>
        <p className="narrative">The quiet girl with the book summons a barrier of light. Defensive magic.</p>
        <p className="narrative">The red-haired girl? She moves like lightning. Dual daggers appear in her hands. Her tier...</p>
        <p className="narrative emphasis">Epic. Maybe Unique.</p>
        <p className="narrative">She's been hiding it.</p>
        <p className="narrative">The beast lunges. Fire, wind, light, steel—all converge.</p>
        <p className="narrative">In thirty seconds, it's over. The shadow beast dissolves into smoke.</p>
        <p className="narrative">The native students are breathing hard but grinning. Showing off.</p>
        <p className="narrative">You four stand at the back. Watching.</p>
        <p className="dialogue-ethan">Quietly: "That was a weak one. The novel said shadow beasts go up to A-rank."</p>
        <p className="dialogue-kira">"And they killed it with teamwork and mid-tier powers."</p>
        <p className="dialogue-maya">"We're going to be so far behind..."</p>
        <p className="dialogue-you">"No. We're going to be underestimated. There's a difference."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'camp2' })}>
          Evening camp
        </button>
      </div>
    </div>
  );

  const renderChapter3Camp2 = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Camp - Second Night</h3>
        <p className="narrative">The second night. Stars overhead. Fire crackling.</p>
        <p className="narrative">The native students are celebrating their victory. Passing around food, laughing.</p>
        <p className="narrative">You four are separate again. Planning.</p>
        <p className="dialogue-kira">"The red-haired girl. She's hiding her true tier. Epic or Unique, I'd bet."</p>
        <p className="dialogue-ethan">"Smart. Same strategy we're using."</p>
        <p className="dialogue-maya">"So she's either very cautious or has something to hide."</p>
        <p className="dialogue-you">"Potential ally or potential threat. We'll need to figure out which."</p>
        <p className="narrative">Kira unfolds a piece of paper. Notes in cramped handwriting.</p>
        <p className="dialogue-kira">"The Convergence cult. According to the novel, they have at least three infiltrators in the first-year class."</p>
        <p className="dialogue-ethan">"And we don't know who they are."</p>
        <p className="dialogue-maya">"So we trust no one. At least not at first."</p>
        <p className="narrative">You stare at the fire.</p>
        <p className="dialogue-you">"The first major event. What was it?"</p>
        <p className="dialogue-kira">"Midterm exams. Two months in. Practical combat evaluation in pairs."</p>
        <p className="dialogue-ethan">"That's where the first death happens. A student named Marcus Vale."</p>
        <p className="narrative">Silence. Heavy.</p>
        <p className="dialogue-maya">"We have two months to get strong enough to change that."</p>
        <p className="dialogue-kira">"And to do it without revealing we know the future."</p>
        <p className="narrative">The fire pops. Sparks rise into the dark.</p>
        <p className="dialogue-you">"Tomorrow we reach the academy. Everything starts for real."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'approach', day: 3 })}>
          Final day
        </button>
      </div>
    </div>
  );

  const renderChapter3Approach = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Day 3 - Academy Approach</h3>
        <p className="narrative">Morning of the third day.</p>
        <p className="narrative">The road crests a hill.</p>
        <p className="narrative">And there it is.</p>
        <p className="narrative emphasis">Astravelle Academy for Awakened Arts.</p>
        <p className="narrative">Massive. Medieval castle architecture mixed with magical enhancements. Towers reaching toward the sky. Walls that shimmer with protective enchantments.</p>
        <p className="narrative">The campus sprawls across the valley. Training grounds, classroom buildings, dormitories, an arena.</p>
        <p className="narrative">Even from here, you can see students flying. Actual flying.</p>
        <p className="dialogue-maya">"...wow."</p>
        <p className="dialogue-ethan">"The novel descriptions didn't do it justice."</p>
        <p className="narrative">Kira's expression is unreadable.</p>
        <p className="dialogue-kira">"This is it. The center of the story. Where everything begins."</p>
        <p className="dialogue-you">"Where everything ends, if we fail."</p>
        <p className="narrative">The merchant calls out.</p>
        <p className="dialogue-npc">"Main gates ahead! Get your letters ready!"</p>
        <p className="narrative">The wagon rolls down the hill.</p>
        <p className="narrative">Toward your new home.</p>
        <p className="narrative">Toward your new future.</p>
        <p className="narrative emphasis">Toward fate itself.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'gates' })}>
          Arrive at gates
        </button>
      </div>
    </div>
  );


  const renderChapter3Gates = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">The Main Gates</h3>
        <p className="narrative">Massive gates. Stone and magic intertwined.</p>
        <p className="narrative">Guards check letters. Students file through in groups.</p>
        <p className="narrative">You hand over your letter. The guard—a stern woman with ice-blue eyes—scans it.</p>
        <p className="dialogue-npc">"First years. Proceed to the registration hall. Follow the gold path."</p>
        <p className="narrative">The ground beneath your feet. Literally glowing gold lines leading inward.</p>
        <p className="narrative">You walk through the gates.</p>
        <p className="narrative">Inside Astravelle Academy.</p>
        <p className="narrative">Students everywhere. Second and third years in colored uniforms. Upperclassmen watching the new arrivals with varying degrees of interest or contempt.</p>
        <p className="dialogue-ethan">"Stay together. Don't get separated."</p>
        <p className="narrative">The registration hall is enormous. High ceilings. Banners showing class rankings: S, A, B, C.</p>
        <p className="narrative">Tables set up. Staff members with crystals and papers.</p>
        <p className="dialogue-npc">"Name?"</p>
        <p className="dialogue-you">{gameState.playerName}</p>
        <p className="dialogue-npc">"Power tier?"</p>
        <p className="dialogue-you">"Common."</p>
        <p className="narrative">The staff member doesn't even look up.</p>
        <p className="dialogue-npc">"C-Class. Next."</p>
        <p className="narrative">That's it. No test. No evaluation.</p>
        <p className="narrative">Common tier? Straight to C-Class.</p>
        <p className="narrative">Kira, Maya, Ethan—same result. C-Class, C-Class, C-Class.</p>
        <p className="narrative">The fire-user from the caravan gets tested. Fire manipulation, Rare tier.</p>
        <p className="dialogue-npc">"B-Class. Conditional placement to A-Class if performance exceeds expectations."</p>
        <p className="narrative">The red-haired girl steps up. And lies.</p>
        <p className="dialogue-npc">"Uncommon tier. Blade affinity."</p>
        <p className="narrative">She's hiding it. Just like you.</p>
        <p className="dialogue-npc">"B-Class."</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'sorting' })}>
          Continue to class assignment
        </button>
      </div>
    </div>
  );

  const renderChapter3Sorting = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">Class Assignment</h3>
        <p className="narrative">C-Class.</p>
        <p className="narrative">Bottom tier. Where Common-rank awakened go.</p>
        <p className="narrative">The four of you receive matching schedules. Same classes, same instructors.</p>
        <p className="narrative">A teaching assistant—a bored-looking third year—addresses the C-Class group.</p>
        <p className="dialogue-npc">"C-Class curriculum: Basic mana control. Foundational combat. Monster ecology. You'll have practical training twice a week."</p>
        <p className="narrative">He pauses, looking over the group with barely concealed disdain.</p>
        <p className="dialogue-npc">"Let's be honest. Most of you won't advance past C-Class. Common tier awakened rarely develop beyond basic competency. Focus on survival, not glory."</p>
        <p className="narrative">Harsh. Brutal. But probably standard for this world.</p>
        <p className="narrative">Around you, some students look crushed. Others defiant.</p>
        <p className="narrative">You four? You exchange glances.</p>
        <p className="narrative emphasis">Perfect.</p>
        <p className="narrative">Low expectations mean room to maneuver.</p>
        <p className="dialogue-npc">"Dorm assignments will be distributed now. Girls' dormitory west wing. Boys' east wing. Two per room."</p>
        <p className="narrative">You receive a key. Room 243.</p>
        <p className="narrative">Ethan gets room 156.</p>
        <p className="narrative">Kira and Maya get room 238.</p>
        <p className="narrative">Close to each other. That's good.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'dorms' })}>
          Head to dorms
        </button>
      </div>
    </div>
  );

  const renderChapter3Dorms = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">C-Class Dormitory</h3>
        <p className="narrative">The C-Class dorms are... adequate.</p>
        <p className="narrative">Not luxurious. Not terrible. Simple rooms with two beds, two desks, one window.</p>
        <p className="narrative">Your roommate hasn't arrived yet.</p>
        <p className="narrative">You set your bag down. Look out the window.</p>
        <p className="narrative">The academy sprawls below. Training grounds in the distance. The main tower at the center.</p>
        <p className="narrative">Somewhere out there: cult infiltrators. Future tragedies. World-ending threats.</p>
        <p className="narrative">A knock at the door. You open it.</p>
        <p className="narrative">Kira, Maya, and Ethan.</p>
        <p className="dialogue-kira">"Quick meeting. Before roommates show up."</p>
        <p className="narrative">You gather in your room.</p>
        <p className="dialogue-ethan">"So. We're in. C-Class. Underestimated. Exactly as planned."</p>
        <p className="dialogue-maya">"First day of classes is tomorrow. We need to play our roles perfectly."</p>
        <p className="dialogue-you">"Weak but trying. Common-tier students who work hard."</p>
        <p className="dialogue-kira">"Meanwhile, we train in secret. Develop our real powers. Stay off everyone's radar."</p>
        <p className="narrative">Ethan looks grim.</p>
        <p className="dialogue-ethan">"Two months until the first death. Marcus Vale. We need to be strong enough by then to change it."</p>
        <p className="narrative">Silence settles.</p>
        <p className="dialogue-maya">"We can do this. We have to."</p>
        <p className="narrative">Another knock. Footsteps in the hallway.</p>
        <p className="dialogue-kira">"Roommates arriving. We'll meet tonight. After lights out."</p>
        <p className="narrative">They slip out.</p>
        <p className="narrative">You're alone again.</p>
        <p className="narrative">First night at Astravelle Academy.</p>
        <p className="narrative emphasis">The real story begins now.</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => updateState({ chapter3Phase: 'end' })}>
          Continue
        </button>
      </div>
    </div>
  );

  const renderChapter3End = () => (
    <div className="scene ch3-scene">
      <div className="scene-content">
        <h3 className="scene-title">First Night</h3>
        <p className="narrative">Late evening. Your roommate—a quiet kid named Liam—is already asleep.</p>
        <p className="narrative">You lie in bed, staring at the ceiling.</p>
        <p className="narrative">Everything feels surreal. Two weeks ago, you were playing video games with friends.</p>
        <p className="narrative">Now you're in a fantasy world. In a body that's not yours. With powers you haven't fully tested.</p>
        <p className="narrative">Trying to prevent the apocalypse.</p>
        <p className="narrative">Your phone is gone. Your family is gone. Your old life is gone.</p>
        <p className="narrative">But your friends are here. And you have a mission.</p>
        <p className="narrative emphasis">Change fate.</p>
        <p className="narrative emphasis">Save this world.</p>
        <p className="narrative emphasis">Prevent the bad ending.</p>
        <p className="narrative">You close your eyes.</p>
        <p className="narrative">Tomorrow, classes begin.</p>
        <p className="narrative">Tomorrow, you start learning this world's secrets.</p>
        <p className="narrative">Tomorrow...</p>
        <p className="narrative">Everything changes.</p>
      </div>
      
      {/* Chapter end card as popup overlay */}
      <div className="chapter-end-overlay">
        <div className="chapter-end-card">
          <div className="end-ornament">✦</div>
          <h2>CHAPTER THREE</h2>
          <h3>THE JOURNEY</h3>
          <div className="end-divider"></div>
          <div className="character-summary">
            <div className="summary-row">
              <span className="summary-name">{gameState.playerName}</span>
              <span className="summary-role">C-Class Student</span>
            </div>
            <div className="summary-row">
              <span className="summary-name">Kira Tanaka</span>
              <span className="summary-role">C-Class Student</span>
            </div>
            <div className="summary-row">
              <span className="summary-name">Maya Cross</span>
              <span className="summary-role">C-Class Student</span>
            </div>
            <div className="summary-row">
              <span className="summary-name">Ethan Reed</span>
              <span className="summary-role">C-Class Student</span>
            </div>
          </div>
          <div className="end-divider"></div>
          <p className="end-quote">"The academy awaits. Two months until the first death. The clock is ticking."</p>
          <button className="continue-btn" onClick={() => alert('Chapter 4 coming soon!\n\nFirst day of classes begins...')}>
            Continue to Chapter 4
          </button>
          <div className="end-ornament bottom">✦</div>
        </div>
      </div>
    </div>
  );
  // Auto-play discord messages
  // Auto-play discord messages
  React.useEffect(() => {
    if (gameState.phase === 'discord' && gameState.discordPhase === 'initial') {
      const messages = getDiscordMessages();
      if (currentMsgIndex < messages.length) {
        const msg = messages[currentMsgIndex];
        
        // Show typing indicator for CURRENT person who's about to send
        updateState({ someoneTyping: msg.user });
        
        // Calculate typing time based on message length (roughly 60 WPM = 5 chars/sec)
        const typingTime = Math.max(1000, Math.min(3000, msg.text.length * 80));
        
        const timer = setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, msg],
            someoneTyping: null
          }));
          setCurrentMsgIndex(prev => prev + 1);
        }, typingTime);
        return () => clearTimeout(timer);
      } else if (currentMsgIndex === messages.length) {
        setTimeout(() => updateState({ showInput: true, someoneTyping: null }), 500);
      }
    } else if (gameState.phase === 'discord' && gameState.discordPhase === 'charTalk') {
      const messages = getCharacterDiscussion();
      if (currentMsgIndex < messages.length) {
        const msg = messages[currentMsgIndex];
        
        // Show typing indicator
        updateState({ someoneTyping: msg.user });
        
        // Calculate typing time
        const typingTime = Math.max(1000, Math.min(3000, msg.text.length * 80));
        
        const timer = setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, msg],
            someoneTyping: null
          }));
          setCurrentMsgIndex(prev => prev + 1);
        }, typingTime);
        return () => clearTimeout(timer);
      } else {
        // Move to character creation
        setTimeout(() => updateState({ phase: 'creation', someoneTyping: null }), 1000);
      }
    }
  }, [gameState.phase, gameState.discordPhase, currentMsgIndex]);

  // Auto-play loading messages
  React.useEffect(() => {
    if (gameState.phase === 'loading') {
      setGameState(prev => ({ ...prev, chatMessages: [] }));
      setCurrentMsgIndex(0);
      const messages = getNovelDiscussion();
      let index = 0;
      const interval = setInterval(() => {
        if (index < messages.length) {
          setGameState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, messages[index]]
          }));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.phase]);

  // Main render
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Fira+Code:wght@400;500&family=Cinzel:wght@600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Crimson Pro', serif;
          background: #0a0a0f;
          color: #e8e8e8;
          line-height: 1.6;
          overflow-x: hidden;
        }

        .game-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .scene {
          max-width: 900px;
          width: 100%;
          min-height: 600px;
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Opening Scene */
        .opening-scene {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .narrative {
          margin-bottom: 40px;
        }

        .narrative p {
          font-size: 1.3rem;
          margin-bottom: 20px;
          opacity: 0;
          animation: fadeInText 1s ease forwards;
        }

        .narrative p:nth-child(1) { animation-delay: 0s; }
        .narrative p:nth-child(2) { animation-delay: 1.5s; }
        .narrative p:nth-child(3) { animation-delay: 3s; }
        .narrative p:nth-child(4) { animation-delay: 4.5s; }
        .narrative p:nth-child(5) { animation-delay: 6s; }
        .narrative p:nth-child(6) { animation-delay: 7.5s; }
        .narrative p:nth-child(7) { animation-delay: 9s; }
        .narrative p:nth-child(8) { animation-delay: 10.5s; }

        @keyframes fadeInText {
          to { opacity: 1; }
        }

        .time {
          font-family: 'Fira Code', monospace;
          font-size: 1rem !important;
          color: #888;
          letter-spacing: 0.1em;
        }

        .emphasis {
          font-style: italic;
          color: #d4af37;
        }

        .small-pause {
          margin-top: 10px;
        }

        .continue-btn {
          padding: 15px 40px;
          background: linear-gradient(135deg, #2a2a3e 0%, #1a1a28 100%);
          border: 2px solid #d4af37;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .continue-btn:hover {
          background: #d4af37;
          color: #0a0a0f;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .delayed-btn {
          opacity: 0;
          pointer-events: none;
          animation: fadeInButton 1s ease 11s forwards;
        }

        @keyframes fadeInButton {
          to { 
            opacity: 1;
            pointer-events: auto;
          }
        }

        /* Discord Scene */
        .discord-scene {
          width: 100vw;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
        }

        .desktop-bg {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .taskbar {
          height: 40px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .taskbar-start {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .start-btn {
          font-size: 1.2rem;
          cursor: pointer;
          padding: 5px 10px;
          transition: background 0.2s;
        }

        .start-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .taskbar-app {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .taskbar-app.active {
          background: rgba(114, 137, 218, 0.3);
          border-bottom: 2px solid #7289da;
        }

        .app-icon {
          font-size: 1rem;
        }

        .taskbar-time {
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
          color: #ddd;
        }

        .discord-window {
          margin: 40px auto;
          width: 90%;
          max-width: 1200px;
          height: calc(100vh - 120px);
          background: #36393f;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
        }

        /* Window titlebar - Windows style */
        .window-titlebar {
          height: 32px;
          background: #202225;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          -webkit-app-region: drag;
        }

        .window-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #b9bbbe;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .discord-icon {
          font-size: 1rem;
        }

        .window-controls {
          display: flex;
          gap: 0;
          -webkit-app-region: no-drag;
        }

        .window-btn {
          width: 46px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: #b9bbbe;
          cursor: pointer;
          transition: background 0.15s;
        }

        .window-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .window-btn.close:hover {
          background: #f04747;
          color: #fff;
        }

        /* Discord content area */
        .discord-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* Server sidebar */
        .discord-sidebar {
          width: 72px;
          background: #202225;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0;
          gap: 8px;
        }

        .server-icon {
          width: 48px;
          height: 48px;
          background: #36393f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          color: #dcddde;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
        }

        .server-icon::before {
          content: '';
          position: absolute;
          left: -16px;
          width: 8px;
          height: 0;
          background: #fff;
          border-radius: 0 4px 4px 0;
          transition: height 0.2s;
        }

        .server-icon:hover {
          border-radius: 16px;
          background: #5865f2;
          color: #fff;
        }

        .server-icon:hover::before {
          height: 20px;
        }

        .server-icon.active {
          border-radius: 16px;
          background: #5865f2;
          color: #fff;
        }

        .server-icon.active::before {
          height: 40px;
        }

        /* Main chat area */
        .discord-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #36393f;
        }

        /* Channel header */
        .discord-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 48px;
          background: #36393f;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05), 0 2px 0 rgba(4, 4, 5, 0.05);
        }

        .channel-name {
          font-family: 'Fira Code', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .channel-name::before {
          content: '#';
          color: #8e9297;
          font-size: 1.3rem;
        }

        .call-status {
          font-size: 0.875rem;
          color: #3ba55d;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .call-status::before {
          content: '';
          width: 8px;
          height: 8px;
          background: #3ba55d;
          border-radius: 50%;
          box-shadow: 0 0 6px #3ba55d;
        }

        /* Messages area */
        .discord-messages {
          padding: 16px 16px 16px 8px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .discord-messages::-webkit-scrollbar {
          width: 16px;
        }

        .discord-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .discord-messages::-webkit-scrollbar-thumb {
          background: #202225;
          border: 4px solid #36393f;
          border-radius: 8px;
        }

        .discord-messages::-webkit-scrollbar-thumb:hover {
          background: #1a1a1f;
        }

        /* Message styling */
        .discord-msg {
          display: flex;
          gap: 16px;
          padding: 2px 16px 2px 8px;
          margin-bottom: 0;
          animation: slideIn 0.3s ease;
        }

        .discord-msg:hover {
          background: rgba(4, 4, 5, 0.07);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .discord-msg.kira .msg-avatar {
          background: #5865f2;
          color: #fff;
        }

        .discord-msg.maya .msg-avatar {
          background: #eb459e;
          color: #fff;
        }

        .discord-msg.ethan .msg-avatar {
          background: #57f287;
          color: #000;
        }

        .discord-msg.you .msg-avatar {
          background: #faa61a;
          color: #000;
        }

        .msg-content {
          flex: 1;
          padding-top: 4px;
        }

        .msg-user {
          font-weight: 500;
          font-size: 1rem;
          margin-bottom: 4px;
          display: inline-block;
        }

        .discord-msg.kira .msg-user { color: #5865f2; }
        .discord-msg.maya .msg-user { color: #eb459e; }
        .discord-msg.ethan .msg-user { color: #57f287; }
        .discord-msg.you .msg-user { color: #faa61a; }

        .msg-text {
          color: #dcddde;
          font-size: 1rem;
          line-height: 1.375;
          word-wrap: break-word;
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex;
          gap: 16px;
          padding: 2px 16px 2px 8px;
          opacity: 0.7;
        }

        .typing-avatar {
          margin-top: 4px;
        }

        .typing-content {
          padding-top: 4px;
        }

        .typing-user {
          font-weight: 500;
          font-size: 1rem;
          color: #b9bbbe;
          margin-bottom: 4px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          height: 16px;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #6e7681;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .choice-panel {
          padding: 20px;
          background: #2f3136;
          border-top: 2px solid #d4af37;
          max-height: 250px;
          overflow-y: auto;
          flex-shrink: 0;
        }

        .choice-panel::-webkit-scrollbar {
          width: 8px;
        }

        .choice-panel::-webkit-scrollbar-track {
          background: #2e3136;
        }

        .choice-panel::-webkit-scrollbar-thumb {
          background: #202225;
          border-radius: 4px;
        }

        .prompt {
          font-size: 1.1rem;
          color: #d4af37;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .choice-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .choice-buttons button {
          width: 100%;
          padding: 15px;
          background: #40444b;
          border: 2px solid transparent;
          color: #e8e8e8;
          font-family: 'Crimson Pro', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .choice-buttons button:hover {
          background: #36393f;
          border-color: #d4af37;
          transform: translateX(5px);
        }

        /* Creation Scene */
        .creation-scene {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .creation-panel {
          width: 100%;
          max-width: 600px;
          padding: 40px;
          background: linear-gradient(135deg, #1a1a28 0%, #2a2a3e 100%);
          border: 2px solid #d4af37;
          border-radius: 8px;
        }

        .creation-panel h2 {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          color: #d4af37;
          text-align: center;
          margin-bottom: 30px;
          letter-spacing: 0.1em;
        }

        .creation-box {
          text-align: center;
        }

        .creation-box label {
          display: block;
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
          color: #888;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }

        .hint {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 20px;
        }

        .creation-box input {
          width: 100%;
          padding: 15px;
          background: #0a0a0f;
          border: 2px solid #444;
          color: #e8e8e8;
          font-family: 'Crimson Pro', serif;
          font-size: 1.2rem;
          text-align: center;
          margin-bottom: 20px;
          transition: border-color 0.3s ease;
        }

        .creation-box input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .creation-box button {
          padding: 15px 40px;
          background: #d4af37;
          border: none;
          color: #0a0a0f;
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .creation-box button:hover {
          background: #e8c547;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .gender-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .gender-buttons button {
          flex: 1;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .gender-buttons .icon {
          font-size: 2rem;
        }

        .alignment-desc {
          text-align: center;
          color: #888;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        .alignment-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .alignment-grid button {
          padding: 20px;
          background: #0a0a0f;
          border: 2px solid #444;
          color: #e8e8e8;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .alignment-grid button:hover {
          border-color: #d4af37;
          background: #1a1a28;
          transform: translateY(-2px);
        }

        .align-icon {
          font-size: 1.5rem;
        }

        .align-name {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          font-weight: 600;
          color: #d4af37;
        }

        .align-desc {
          font-size: 0.85rem;
          color: #888;
          font-style: italic;
        }

        .note {
          text-align: center;
          font-size: 0.85rem;
          color: #666;
          font-style: italic;
        }

        /* Loading Scene */
        .loading-scene {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .loading-content {
          text-align: center;
          width: 100%;
        }

        .loading-title {
          font-family: 'Cinzel', serif;
          font-size: 2.5rem;
          color: #d4af37;
          margin-bottom: 30px;
          letter-spacing: 0.15em;
        }

        .loading-bar {
          width: 100%;
          height: 8px;
          background: #1a1a28;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 30px;
        }

        .loading-fill {
          height: 100%;
          background: linear-gradient(90deg, #d4af37 0%, #e8c547 100%);
          animation: loading 3s ease-in-out infinite;
          width: 0%;
        }

        .loading-fill.complete {
          animation: none;
          width: 100%;
          transition: width 0.5s ease;
        }

        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        .loading-messages {
          max-width: 600px;
          margin: 0 auto;
          text-align: left;
        }

        .loading-msg {
          margin-bottom: 10px;
          opacity: 0;
          animation: fadeInText 0.5s ease forwards;
        }

        .loading-msg strong {
          color: #d4af37;
        }

        .start-panel {
          background: linear-gradient(135deg, #1a1a28 0%, #2a2a3e 100%);
          border: 2px solid #d4af37;
          border-radius: 8px;
          padding: 30px;
        }

        .start-box h3 {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          color: #d4af37;
          text-align: center;
          margin-bottom: 20px;
          letter-spacing: 0.1em;
        }

        .players-ready {
          margin-bottom: 25px;
        }

        .player-check {
          font-family: 'Fira Code', monospace;
          color: #43b581;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .start-btn {
          display: block;
          width: 100%;
          padding: 20px;
          background: #d4af37;
          border: none;
          color: #0a0a0f;
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 700;
        }

        .start-btn:hover {
          background: #e8c547;
          transform: scale(1.05);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
        }

        /* Transmigration Scene */
        .transmigration-scene {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(180deg, #fff 0%, #0a0a0f 50%, #000 100%);
          animation: whiteFlash 8s ease forwards;
        }

        @keyframes whiteFlash {
          0% { background: #fff; }
          10% { background: #fff; }
          30% { background: rgba(255,255,255,0.8); }
          50% { background: rgba(255,255,255,0.3); }
          70% { background: rgba(10,10,15,0.8); }
          100% { background: #000; }
        }

        .transmigration-content {
          text-align: center;
          max-width: 600px;
        }

        .transmigration-content p {
          font-size: 1.3rem;
          margin-bottom: 25px;
          opacity: 0;
        }

        .glitch {
          animation: glitchText 0.3s ease infinite, fadeInText 0.5s ease forwards;
          color: #fff;
        }

        @keyframes glitchText {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .fade-in {
          animation: fadeInText 1s ease forwards;
        }

        .delay-1 { animation-delay: 1s; }
        .delay-2 { animation-delay: 2s; }
        .delay-3 { animation-delay: 3s; }
        .delay-4 { animation-delay: 4s; }
        .delay-5 { animation-delay: 5s; }
        .delay-6 { animation-delay: 6s; }

        .distorted {
          animation: fadeInText 0.5s ease forwards;
          font-family: 'Fira Code', monospace;
          color: #f00;
          font-size: 1rem;
        }

        .static {
          animation: fadeInText 0.3s ease forwards, staticNoise 0.1s infinite;
          color: #888;
        }

        @keyframes staticNoise {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .dots {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin: 40px 0;
        }

        .dots span {
          font-size: 2rem;
          opacity: 0;
          animation: dotFade 1.5s ease infinite;
        }

        .dots span:nth-child(1) { animation-delay: 0s; }
        .dots span:nth-child(2) { animation-delay: 0.3s; }
        .dots span:nth-child(3) { animation-delay: 0.6s; }

        @keyframes dotFade {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .final-line {
          font-size: 1.5rem;
          animation: fadeInText 2s ease 7s forwards;
          color: #d4af37;
        }

        .chapter-end {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, transparent 0%, #0a0a0f 10%, #0a0a0f 100%);
          padding: 60px 30px 40px;
          text-align: center;
          animation: slideUp 1s ease 9s forwards;
          transform: translateY(100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        @keyframes slideUp {
          to { transform: translateY(0); }
        }

        .end-ornament {
          font-size: 2rem;
          color: #d4af37;
          opacity: 0;
          animation: fadeInText 1s ease 10s forwards;
        }

        .end-ornament.bottom {
          margin-top: 20px;
        }

        .chapter-end h2 {
          font-family: 'Cinzel', serif;
          font-size: 2.5rem;
          color: #d4af37;
          margin: 0;
          letter-spacing: 0.2em;
          opacity: 0;
          animation: fadeInText 1s ease 10.3s forwards;
        }

        .chapter-end h3 {
          font-family: 'Cinzel', serif;
          font-size: 1.2rem;
          color: #888;
          margin: 0;
          letter-spacing: 0.3em;
          font-weight: 400;
          opacity: 0;
          animation: fadeInText 1s ease 10.6s forwards;
        }

        .end-divider {
          width: 200px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          opacity: 0;
          animation: fadeInText 1s ease 10.9s forwards;
        }

        .character-summary {
          display: flex;
          gap: 40px;
          opacity: 0;
          animation: fadeInText 1s ease 11.2s forwards;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .summary-label {
          font-family: 'Fira Code', monospace;
          font-size: 0.7rem;
          color: #666;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .summary-value {
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          color: #d4af37;
          text-transform: capitalize;
        }

        .end-quote {
          font-style: italic;
          color: #888;
          font-size: 1rem;
          max-width: 500px;
          opacity: 0;
          animation: fadeInText 1s ease 11.5s forwards;
        }

        .chapter-end button {
          margin-top: 10px;
          padding: 18px 50px;
          background: transparent;
          border: 2px solid #d4af37;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0;
          animation: fadeInText 1s ease 11.8s forwards;
        }

        .chapter-end button:hover {
          background: #d4af37;
          color: #0a0a0f;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        @media (max-width: 768px) {
          .alignment-grid {
            grid-template-columns: 1fr;
          }
          
          .gender-buttons {
            flex-direction: column;
          }

          .loading-title {
            font-size: 1.8rem;
          }

          .creation-panel {
            padding: 20px;
          }
        }

        /* ============================================ */
        /* ============================================ */
        /* MENU SYSTEM */
        /* ============================================ */

        .menu-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 50px;
          background: #1a1a28;
          border-bottom: 2px solid #d4af37;
          display: flex;
          justify-content: center;
          gap: 0;
          z-index: 900;
        }

        .menu-tab {
          padding: 0 24px;
          background: transparent;
          border: none;
          border-right: 1px solid #2a2a38;
          color: #b0b0b0;
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .menu-tab:hover {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }

        .menu-tab.active {
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          border-bottom: 2px solid #d4af37;
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 950;
          backdrop-filter: blur(4px);
        }

        .menu-panel {
          background: #12121a;
          border: 2px solid #d4af37;
          width: 90%;
          max-width: 800px;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 1px solid #2a2a38;
        }

        .menu-header h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 1.5rem;
          margin: 0;
          letter-spacing: 0.1em;
        }

        .menu-close {
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid #666;
          color: #999;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        .menu-close:hover {
          border-color: #d4af37;
          color: #d4af37;
        }

        .menu-content {
          padding: 30px;
          overflow-y: auto;
          flex: 1;
        }

        .menu-content::-webkit-scrollbar {
          width: 8px;
        }

        .menu-content::-webkit-scrollbar-track {
          background: #0a0a0f;
        }

        .menu-content::-webkit-scrollbar-thumb {
          background: #2a2a38;
          border-radius: 4px;
        }

        /* Character Menu */
        .character-info .info-section {
          margin-bottom: 30px;
        }

        .character-info h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 1.2rem;
          margin-bottom: 15px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #1a1a28;
          border: 1px solid #2a2a38;
          margin-bottom: 8px;
        }

        .info-label {
          font-family: 'Fira Code', monospace;
          color: #999;
          font-size: 0.9rem;
        }

        .info-value {
          color: #e8e8e8;
          font-size: 0.95rem;
        }

        .info-value.tier {
          color: #d4af37;
          font-weight: 600;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .stat-item {
          display: grid;
          grid-template-columns: 120px 1fr 40px;
          align-items: center;
          gap: 15px;
        }

        .stat-name {
          font-family: 'Fira Code', monospace;
          color: #b0b0b0;
          font-size: 0.9rem;
        }

        .stat-bar-wrap {
          height: 12px;
          background: #0a0a0f;
          border: 1px solid #2a2a38;
          border-radius: 2px;
          overflow: hidden;
        }

        .stat-bar {
          height: 100%;
          background: linear-gradient(90deg, #d4af37 0%, #f0d98e 100%);
          transition: width 0.3s;
        }

        .stat-value {
          font-family: 'Fira Code', monospace;
          color: #d4af37;
          font-size: 0.9rem;
          text-align: right;
        }

        /* Abilities Menu */
        .abilities-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .ability-card {
          padding: 20px;
          background: #1a1a28;
          border: 1px solid #2a2a38;
        }

        .ability-card h4 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 10px;
        }

        .ability-card p {
          color: #b0b0b0;
          line-height: 1.6;
        }

        /* Inventory Menu */
        .inventory-view .equipped-section {
          margin-bottom: 30px;
        }

        .inventory-view h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 15px;
        }

        .equip-slot {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #1a1a28;
          border: 1px solid #2a2a38;
          margin-bottom: 8px;
        }

        .slot-name {
          font-family: 'Fira Code', monospace;
          color: #999;
          font-size: 0.9rem;
        }

        .slot-item {
          color: #e8e8e8;
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .item-card {
          padding: 15px;
          background: #1a1a28;
          border: 1px solid #2a2a38;
        }

        .item-name {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 8px;
        }

        .item-desc {
          color: #999;
          font-size: 0.85rem;
        }

        /* Wallet Menu */
        .wallet-view {
          text-align: center;
        }

        .money-display {
          padding: 40px;
          background: #1a1a28;
          border: 2px solid #d4af37;
          margin-bottom: 20px;
        }

        .money-amount {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 3rem;
          color: #d4af37;
          margin-bottom: 10px;
        }

        .money-label {
          font-family: 'Fira Code', monospace;
          color: #999;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
        }

        .money-note {
          color: #b0b0b0;
          font-style: italic;
        }

        /* Crafting Menu */
        .crafting-view {
          text-align: center;
          padding: 60px 20px;
        }

        .locked-message h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .locked-message p {
          color: #999;
          margin-bottom: 10px;
        }

        .locked-message .hint {
          color: #666;
          font-style: italic;
          font-size: 0.9rem;
        }

        /* Affection Menu */
        .affection-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .affection-item {
          padding: 20px;
          background: #1a1a28;
          border: 1px solid #2a2a38;
        }

        .affection-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .character-name {
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
        }

        .character-name.kira { color: #7289da; }
        .character-name.maya { color: #f093fb; }
        .character-name.ethan { color: #4facfe; }

        .affection-value {
          font-family: 'Fira Code', monospace;
          color: #d4af37;
          font-size: 0.9rem;
        }

        .affection-bar-wrap {
          height: 16px;
          background: #0a0a0f;
          border: 1px solid #2a2a38;
          border-radius: 2px;
          overflow: hidden;
        }

        .affection-bar {
          height: 100%;
          transition: width 0.3s;
        }

        .affection-bar.kira { background: #7289da; }
        .affection-bar.maya { background: #f093fb; }
        .affection-bar.ethan { background: #4facfe; }

        /* Journal Menu */
        .journal-view .journal-section {
          margin-bottom: 30px;
        }

        .journal-view h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 15px;
        }

        .quest-card, .lore-card {
          padding: 20px;
          background: #1a1a28;
          border: 1px solid #2a2a38;
          margin-bottom: 12px;
        }

        .quest-card h4, .lore-card h4 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 10px;
        }

        .quest-card p, .lore-card p {
          color: #b0b0b0;
          line-height: 1.6;
        }

        /* Empty states */
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .empty-state .hint {
          font-style: italic;
          font-size: 0.9rem;
          margin-top: 10px;
          color: #555;
        }

        /* Adjust game-root when menu is visible */
        .game-root {
          padding-top: 0;
        }

        body.has-menu .game-root {
          padding-top: 50px;
        }
        /* CHAPTER 2 - CLEAN MINIMAL STYLING */
        /* ============================================ */

        /* Shared Chapter 2 variables */
        .blackness-scene, .awakening-scene, .room-scene, .panic-scene,
        .simple-dialogue-scene, .letter-scene, .preparation-scene {
          --ch2-bg: #0a0a0f;
          --ch2-bg2: #12121a;
          --ch2-bg3: #1a1a28;
          --ch2-text: #e8e8e8;
          --ch2-text2: #b0b0b0;
          --ch2-text3: #707070;
          --ch2-accent: #d4af37;
          --ch2-border: #2a2a38;
        }

        /* Blackness - pure void */
        .blackness-scene {
          background: #000;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .blackness-content {
          max-width: 700px;
          text-align: center;
        }

        .blackness-content p {
          font-size: 2rem;
          color: #555;
          margin-bottom: 40px;
          opacity: 0;
        }

        .fade-btn-ch2 {
          padding: 12px 32px;
          background: transparent;
          border: 1px solid #555;
          color: #555;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0;
          pointer-events: none;
          animation: fadeInButton 1s ease 10.5s forwards;
        }

        .fade-btn-ch2:hover {
          border-color: var(--ch2-accent);
          color: var(--ch2-accent);
        }

        /* Awakening - simple dark scene */
        .awakening-scene {
          background: var(--ch2-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .awakening-content {
          max-width: 800px;
          text-align: center;
        }

        .awakening-content p {
          font-size: 1.2rem;
          color: var(--ch2-text2);
          margin-bottom: 20px;
          line-height: 1.8;
        }

        .pause {
          margin-top: 30px !important;
        }

        .action-buttons {
          margin-top: 40px;
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .action-buttons button {
          padding: 12px 24px;
          background: var(--ch2-bg3);
          border: 1px solid var(--ch2-border);
          color: var(--ch2-text);
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-buttons button:hover {
          border-color: var(--ch2-accent);
          background: var(--ch2-bg2);
        }

        /* Room - examination scene */
        .room-scene {
          background: var(--ch2-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
        }

        .room-description {
          max-width: 800px;
          text-align: center;
          margin-bottom: 40px;
        }

        .room-description h3 {
          font-family: 'Cinzel', serif;
          color: var(--ch2-accent);
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .room-description p {
          font-size: 1.1rem;
          color: var(--ch2-text2);
          margin-bottom: 15px;
          line-height: 1.7;
        }

        .examine-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          max-width: 800px;
          width: 100%;
        }

        .examine-item {
          padding: 20px;
          background: var(--ch2-bg3);
          border: 1px solid var(--ch2-border);
          cursor: pointer;
          transition: all 0.2s;
        }

        .examine-item:hover {
          border-color: var(--ch2-accent);
        }

        .examine-item.examined {
          border-color: var(--ch2-accent);
          background: var(--ch2-bg2);
        }

        .examine-icon {
          font-size: 2rem;
          display: block;
          text-align: center;
          margin-bottom: 10px;
        }

        .examine-label {
          font-family: 'Cinzel', serif;
          color: var(--ch2-accent);
          font-size: 1rem;
          text-align: center;
          display: block;
          margin-bottom: 10px;
        }

        .examine-result {
          color: var(--ch2-text2);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--ch2-border);
        }

        /* Panic - simple choice scene */
        .panic-scene {
          background: var(--ch2-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .panic-content {
          max-width: 700px;
          text-align: center;
          margin-bottom: 40px;
        }

        .panic-content h3 {
          font-family: 'Cinzel', serif;
          color: var(--ch2-accent);
          font-size: 2rem;
          margin-bottom: 25px;
        }

        .panic-content p {
          font-size: 1.1rem;
          color: var(--ch2-text2);
          margin-bottom: 15px;
        }

        .choice-panel-ch2 {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 600px;
          width: 100%;
        }

        .choice-panel-ch2 button {
          padding: 15px 20px;
          background: var(--ch2-bg3);
          border: 1px solid var(--ch2-border);
          color: var(--ch2-text2);
          font-family: 'Crimson Pro', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .choice-panel-ch2 button:hover {
          border-color: var(--ch2-accent);
          background: var(--ch2-bg2);
        }

        /* Dialogue scenes - clean boxes */
        .simple-dialogue-scene {
          background: var(--ch2-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .dialogue-box {
          max-width: 800px;
          width: 100%;
          background: var(--ch2-bg2);
          border: 1px solid var(--ch2-border);
          padding: 40px;
        }

        .dialogue-line {
          font-size: 1.1rem;
          margin-bottom: 18px;
          line-height: 1.7;
        }

        .dialogue-line.narrative {
          color: var(--ch2-text);
        }

        .dialogue-line.emphasis {
          color: var(--ch2-accent);
          font-style: italic;
        }

        .dialogue-line.dialogue-you {
          color: #f5af19;
          font-style: italic;
          padding-left: 20px;
          border-left: 2px solid #f5af19;
        }

        .dialogue-line.dialogue-kira {
          color: #7289da;
          font-style: italic;
          padding-left: 20px;
          border-left: 2px solid #7289da;
        }

        .dialogue-line.dialogue-maya {
          color: #f093fb;
          font-style: italic;
          padding-left: 20px;
          border-left: 2px solid #f093fb;
        }

        .dialogue-line.dialogue-ethan {
          color: #4facfe;
          font-style: italic;
          padding-left: 20px;
          border-left: 2px solid #4facfe;
        }

        .dialogue-line.dialogue-innkeeper {
          color: #999;
          font-style: italic;
          padding-left: 20px;
          border-left: 2px solid #888;
        }

        .section-title {
          font-family: 'Cinzel', serif;
          color: var(--ch2-accent);
          font-size: 1.8rem;
          text-align: center;
          margin-bottom: 30px;
        }

        /* Letter scene */
        .letter-scene {
          background: var(--ch2-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .letter-content {
          max-width: 800px;
          width: 100%;
        }

        .letter-content .narrative,
        .letter-content .dialogue-line {
          text-align: center;
        }

        .letter-paper {
          background: #f5f5dc;
          color: #2a2a2a;
          padding: 40px;
          margin: 30px 0;
          border: 2px solid var(--ch2-accent);
        }

        .letter-header {
          font-family: 'Cinzel', serif;
          font-size: 1.4rem;
          margin-bottom: 20px;
          text-align: center;
        }

        .letter-body {
          margin-bottom: 15px;
          line-height: 1.8;
          font-size: 1rem;
        }

        .letter-signature {
          margin-top: 30px;
          text-align: right;
          font-style: italic;
        }

        .letter-date {
          margin-top: 30px;
          text-align: center;
          font-size: 0.9rem;
          color: #666;
        }

        /* Preparation scene */
        .preparation-scene {
          background: var(--ch2-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .prep-content {
          max-width: 700px;
          text-align: center;
          margin-bottom: 60px;
        }

        .prep-content h3 {
          font-family: 'Cinzel', serif;
          color: var(--ch2-accent);
          font-size: 2rem;
          margin-bottom: 30px;
        }

        .prep-content p {
          font-size: 1.1rem;
          color: var(--ch2-text2);
          margin-bottom: 15px;
          line-height: 1.7;
        }

        /* Chapter end overlay - popup on top of scene */
        .chapter-end-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          animation: fadeInOverlay 1s ease 2s forwards;
          backdrop-filter: blur(8px);
        }

        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Chapter end card - clean and simple */
        .chapter-end-card {
          background: var(--ch2-bg2);
          border: 2px solid var(--ch2-accent);
          padding: 50px 40px;
          text-align: center;
          max-width: 900px;
          width: 90%;
          transform: scale(0.9);
          animation: popIn 0.6s ease 2.3s forwards;
        }

        @keyframes popIn {
          from {
            transform: scale(0.9);
          }
          to {
            transform: scale(1);
          }
        }

        .end-ornament {
          font-size: 2rem;
          color: var(--ch2-accent);
          margin-bottom: 15px;
        }

        .end-ornament.bottom {
          margin-top: 20px;
          margin-bottom: 0;
        }

        .chapter-end-card h2 {
          font-family: 'Cinzel', serif;
          font-size: 2.5rem;
          color: var(--ch2-accent);
          margin-bottom: 10px;
          letter-spacing: 0.1em;
        }

        .chapter-end-card h3 {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: var(--ch2-text3);
          letter-spacing: 0.2em;
          font-weight: 400;
          margin-bottom: 25px;
          text-transform: uppercase;
        }

        .character-summary {
          width: 100%;
          margin: 25px 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .summary-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 15px;
          background: var(--ch2-bg3);
          border: 1px solid var(--ch2-border);
          text-align: center;
          gap: 8px;
        }

        .summary-name {
          font-family: 'Cinzel', serif;
          color: var(--ch2-accent);
          font-size: 1.1rem;
        }

        .summary-role {
          font-family: 'Fira Code', monospace;
          color: var(--ch2-text3);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .end-quote {
          font-style: italic;
          color: var(--ch2-text3);
          font-size: 1rem;
          margin: 20px 0;
        }

        .end-divider {
          width: 150px;
          height: 1px;
          background: var(--ch2-accent);
          margin: 20px auto;
        }

        .continue-btn {
          padding: 12px 32px;
          background: transparent;
          border: 1px solid var(--ch2-accent);
          color: var(--ch2-accent);
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 20px;
        }

        .continue-btn:hover {
          background: var(--ch2-accent);
          color: var(--ch2-bg);
        }

        @media (max-width: 768px) {
          .examine-grid {
            grid-template-columns: 1fr;
          }

          .dialogue-box {
            padding: 25px;
          }

          .chapter-end-card {
            padding: 30px 20px;
          }

          .character-summary {
            grid-template-columns: 1fr;
          }
        }

        /* ============================================ */
        /* MAIN MENU & SAVE SYSTEM */
        /* ============================================ */

        .main-menu {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a28 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .menu-container {
          max-width: 800px;
          width: 100%;
          text-align: center;
        }

        .game-title {
          font-family: 'Cinzel', serif;
          font-size: 4rem;
          color: #d4af37;
          margin-bottom: 20px;
          letter-spacing: 0.2em;
        }

        .game-subtitle {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          color: #b0b0b0;
          margin-bottom: 60px;
          letter-spacing: 0.1em;
        }

        .menu-options {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .menu-btn.new-game {
          padding: 18px 50px;
          background: transparent;
          border: 2px solid #d4af37;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.1em;
        }

        .menu-btn.new-game:hover {
          background: #d4af37;
          color: #0a0a0f;
          transform: scale(1.05);
        }

        .save-slots-section h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 1.5rem;
          margin-bottom: 25px;
          letter-spacing: 0.1em;
        }

        .save-slots {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .save-slot {
          background: #1a1a28;
          border: 2px solid #2a2a38;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .save-slot.has-save {
          border-color: #d4af37;
        }

        .save-slot.empty {
          opacity: 0.6;
        }

        .save-info {
          text-align: left;
          flex: 1;
        }

        .save-slot-num {
          font-family: 'Fira Code', monospace;
          color: #d4af37;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .save-name {
          font-size: 1.2rem;
          color: #e8e8e8;
          font-family: 'Cinzel', serif;
          margin: 5px 0;
        }

        .save-phase {
          color: #999;
          font-size: 0.95rem;
          margin: 3px 0;
        }

        .save-date {
          color: #666;
          font-size: 0.8rem;
          margin-top: 5px;
          font-family: 'Fira Code', monospace;
        }

        .save-actions {
          display: flex;
          gap: 10px;
        }

        .save-actions button,
        .load-btn,
        .delete-btn {
          padding: 10px 24px;
          background: transparent;
          border: 1px solid #d4af37;
          color: #d4af37;
          cursor: pointer;
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .save-actions button:hover,
        .load-btn:hover {
          background: #d4af37;
          color: #0a0a0f;
        }

        .delete-btn {
          border-color: #8b0000;
          color: #8b0000;
        }

        .delete-btn:hover {
          background: #8b0000;
          color: #fff;
        }

        .save-empty {
          width: 100%;
          text-align: center;
        }

        .empty-text {
          color: #666;
          font-style: italic;
          font-size: 1.1rem;
          margin-top: 5px;
        }

        /* Loading Screen */
        .loading-screen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-content {
          text-align: center;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #2a2a38;
          border-top: 4px solid #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-content p {
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1.2rem;
          letter-spacing: 0.1em;
        }

        /* Save Menu Panel */
        .save-menu-panel {
          padding: 20px 0;
        }

        .save-instruction {
          text-align: center;
          color: #b0b0b0;
          margin-bottom: 25px;
          font-size: 1.05rem;
        }

        .save-slot-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .save-slot-option {
          background: #1a1a28;
          border: 1px solid #2a2a38;
          padding: 20px;
        }

        .slot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .slot-header strong {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 1.1rem;
        }

        .overwrite-warning {
          color: #8b0000;
          font-size: 0.85rem;
          font-style: italic;
        }

        .existing-save-info {
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(212, 175, 55, 0.05);
          border-left: 2px solid #d4af37;
        }

        .save-preview-name {
          color: #e8e8e8;
          margin-bottom: 5px;
        }

        .save-preview-date {
          color: #666;
          font-size: 0.85rem;
          font-family: 'Fira Code', monospace;
        }

        .save-slot-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 2px solid #d4af37;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-slot-btn:hover {
          background: #d4af37;
          color: #0a0a0f;
        }

        /* ============================================ */
        /* CHAPTER 3 STYLES */
        /* ============================================ */

        .ch3-scene {
          background: var(--ch2-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
        }

        .chapter-title {
          font-family: 'Cinzel', serif;
          font-size: 2.5rem;
          color: var(--ch2-accent);
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: 0.1em;
        }

        .scene-title {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          color: var(--ch2-accent);
          text-align: center;
          margin-bottom: 30px;
        }

        .scene-content {
          max-width: 850px;
          width: 100%;
        }

        .scene-content .narrative {
          font-size: 1.15rem;
          color: var(--ch2-text);
          margin-bottom: 18px;
          line-height: 1.8;
        }

        .scene-content .narrative.emphasis {
          color: var(--ch2-accent);
          font-style: italic;
        }

        .dialogue-npc {
          color: #999;
          font-style: italic;
          padding-left: 20px;
          border-left: 2px solid #666;
          margin-bottom: 18px;
          display: block;
          font-size: 1.15rem;
        }
      `}</style>
      
      {renderMenuBar()}
      {renderMenuPanel()}
      
      <div className="game-root">
        {gameState.phase === 'main-menu' && renderMainMenu()}
        {gameState.phase === 'opening' && renderOpening()}
        {gameState.phase === 'discord' && renderDiscord()}
        {gameState.phase === 'creation' && renderCreation()}
        {gameState.phase === 'loading' && renderLoading()}
        {gameState.phase === 'transmigration' && renderTransmigration()}
        {gameState.phase === 'chapter2' && renderChapter2()}
        {gameState.phase === 'chapter3' && renderChapter3()}
      </div>
    </>
  );
}
