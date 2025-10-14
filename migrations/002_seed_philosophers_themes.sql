-- Insert Philosophers
INSERT INTO philosophers (name, era, birth_year, death_year, biography, key_works, core_teachings) VALUES
('Marcus Aurelius', 'Roman Empire', 121, 180, 
'Marcus Aurelius was Roman Emperor from 161 to 180 CE and is considered one of the most important Stoic philosophers. Born into a prominent Roman family, he received an excellent education and was adopted by Emperor Antoninus Pius. As emperor, he faced numerous challenges including wars, plague, and political turmoil, yet maintained his philosophical principles throughout. His personal journal, "Meditations," written during military campaigns, reveals a man constantly striving for self-improvement and virtue. Unlike other philosophers who taught from ivory towers, Marcus practiced Stoicism while bearing the weight of an empire. He believed in the interconnectedness of all things and the importance of accepting what cannot be changed while taking action on what can. His reign is often considered the end of the Pax Romana and the beginning of Rome''s decline, yet his philosophical legacy has endured for nearly two millennia.', 
'Meditations (Ta eis heauton)', 
'Focus on what you can control; Accept fate with equanimity; Practice virtue in all circumstances; Recognize the impermanence of all things; Serve the common good; Maintain inner tranquility amid external chaos'),

('Seneca', 'Roman Empire', -4, 65,
'Lucius Annaeus Seneca, known as Seneca the Younger, was a Roman Stoic philosopher, statesman, and dramatist. Born in Cordoba, Spain, he was educated in Rome and became one of the most influential intellectuals of his time. His life was marked by dramatic reversals of fortune: he served as advisor to Emperor Nero, was exiled to Corsica for eight years, accumulated great wealth, and ultimately was forced to commit suicide by Nero. These experiences gave him unique insights into power, adversity, and human nature. Seneca wrote extensively on Stoic philosophy, making it accessible to the Roman elite through letters, essays, and dialogues. His works emphasize practical ethics, the proper use of time, the management of anger, and the cultivation of tranquility. He believed that philosophy should be a guide to living well, not merely an intellectual exercise. His writings bridge the gap between abstract philosophical principles and daily life challenges, making Stoicism relevant to people in positions of power and responsibility.',
'Letters from a Stoic (Epistulae Morales ad Lucilium); On the Shortness of Life; On Anger; On Providence',
'Time is our most precious resource; Prepare for adversity before it arrives; Wealth and poverty are external to happiness; Practice voluntary discomfort to build resilience; Death is natural and not to be feared; Philosophy must be practiced, not just studied'),

('Epictetus', 'Roman Empire', 50, 135,
'Epictetus was born a slave in Hierapolis, Phrygia (modern-day Turkey) and later gained his freedom. Despite his humble origins, he became one of the most influential Stoic philosophers, teaching in Rome and later in Nicopolis, Greece. His early life as a slave gave him firsthand experience of powerlessness, which deeply influenced his philosophy of focusing on what is within our control. According to tradition, his master broke his leg during punishment, and Epictetus calmly warned him it would break, then simply stated "I told you so" when it did—demonstrating his Stoic principles even in suffering. He never wrote anything himself, but his student Arrian recorded his teachings in "The Discourses" and compiled the "Enchiridion" (Handbook), a practical manual of Stoic philosophy. Epictetus taught that external events are not under our control, but our responses always are. He emphasized the dichotomy of control as the foundation of Stoic practice and believed that suffering comes from desiring what we cannot control. His teachings influenced both Marcus Aurelius and early Christian thought, and remain remarkably relevant to modern psychology and cognitive therapy.',
'The Discourses; The Enchiridion (Handbook)',
'Master the dichotomy of control; Freedom comes from accepting what we cannot change; Our judgments, not events, cause our suffering; Practice negative visualization; View obstacles as opportunities for virtue; Constantly examine your impressions and judgments');

-- Insert Themes
INSERT INTO themes (name, description, principle, scientific_connection, cbt_connection, neuroscience_connection, psychology_connection) VALUES
('Dichotomy of Control', 
'The fundamental distinction between what is within our control (our thoughts, judgments, and actions) and what is not (external events, others'' actions, outcomes). This principle teaches us to focus our energy only on what we can influence.',
'Focus on what you can control, accept what you cannot. Invest your energy wisely.',
'Research in stress psychology shows that perceived control is a key factor in resilience. Studies demonstrate that people who distinguish between controllable and uncontrollable factors show lower cortisol levels and better stress management.',
'CBT''s core principle of separating thoughts from events mirrors this Stoic teaching. Cognitive restructuring helps patients identify what they can control (their interpretations) versus what they cannot (external circumstances).',
'Neuroscience research shows that the prefrontal cortex activates when we exercise self-control and make deliberate choices. Accepting what we cannot control reduces amygdala activation, lowering anxiety responses.',
'Aligns with locus of control research by Rotter. Internal locus of control (believing you control your responses) correlates with better mental health, higher achievement, and greater life satisfaction.'),

('Negative Visualization', 
'The practice of contemplating potential losses, difficulties, or worst-case scenarios to reduce anxiety about the future and increase gratitude for the present. Also called premeditatio malorum.',
'Imagine losing what you have to appreciate it more. Prepare mentally for adversity.',
'Prospective studies show that mental preparation for potential stressors improves coping outcomes. Exposure therapy, based on gradual visualization of feared scenarios, successfully treats anxiety disorders.',
'Closely related to exposure therapy and worry postponement techniques. CBT uses "decatastrophizing" to help patients realize that imagined worst-case scenarios are often manageable.',
'Mental rehearsal activates similar neural pathways as actual experiences, creating preparedness. Controlled stress inoculation builds resilience by strengthening stress-response systems without overwhelming them.',
'Related to psychologist Julie Norem''s research on defensive pessimism, where considering possible negative outcomes actually improves performance and reduces anxiety for certain personality types.'),

('Virtue as the Sole Good',
'The Stoic belief that the only true good is virtue (wisdom, justice, courage, temperance), and that external things like wealth, health, or reputation are "preferred indifferents"—nice to have but not essential for happiness.',
'Virtue is sufficient for happiness. External circumstances are indifferent to well-being.',
'Studies on intrinsic vs. extrinsic values show that people focused on internal goods (personal growth, relationships, contribution) report higher well-being than those focused on external goods (wealth, fame, appearance).',
'Values clarification in ACT (Acceptance and Commitment Therapy) helps patients identify what truly matters. Research shows that living according to one''s values predicts life satisfaction better than achieving external goals.',
'Reward systems in the brain respond differently to intrinsic rewards (sense of purpose, helping others) than extrinsic rewards (money, status). Intrinsic rewards activate sustained dopamine release and greater prefrontal engagement.',
'Self-Determination Theory (Deci & Ryan) demonstrates that intrinsic motivation and authentic values lead to greater psychological well-being than extrinsic motivators.'),

('Amor Fati',
'Love of fate—the practice of not merely accepting but embracing everything that happens, including hardships and setbacks. Seeing obstacles as opportunities for growth.',
'Love your fate. Welcome obstacles as chances to practice virtue and grow stronger.',
'Post-traumatic growth research shows that many people report positive changes after adversity, including greater appreciation for life, stronger relationships, and increased personal strength.',
'Reframing techniques in CBT help patients find alternative, more helpful interpretations of events. Research on benefit-finding shows that discovering positive meaning in negative events improves mental health.',
'Cognitive flexibility, supported by prefrontal cortex function, allows for perspective-taking and reappraisal. Training in reframing activates different neural pathways and reduces emotional reactivity.',
'Research on resilience factors shows that finding meaning in adversity is one of the strongest predictors of psychological recovery and growth following trauma.'),

('Memento Mori',
'Remembering mortality—contemplating death not morbidly but as motivation to live fully, appreciate the present, and prioritize what truly matters.',
'Remember you will die. Let mortality focus your life on what matters.',
'Terror Management Theory research shows that subtle death reminders can increase prosocial behavior and reduce materialism. Awareness of mortality can enhance meaningful pursuits when not anxiety-provoking.',
'Existential therapy incorporates death awareness as central to living authentically. Studies show that confronting mortality in a supported way reduces death anxiety and increases life engagement.',
'Default mode network activation during mortality contemplation is associated with self-reflection and value clarification. Reduced activity in anxiety circuits when death is accepted philosophically.',
'Research by psychologist Sheldon Solomon shows that death awareness, when processed constructively, leads to increased compassion, reduced prejudice, and greater focus on legacy and contribution.'),

('Cosmopolitanism',
'The view that all human beings belong to a single community based on shared rationality. We are citizens of the world first, with duties to all humanity.',
'See yourself as a citizen of the world. We are all connected in the common good.',
'Social neuroscience reveals that empathy circuits activate across cultural boundaries. Oxytocin release during prosocial behavior is universal, supporting the idea of shared human nature.',
'CBT''s cognitive restructuring challenges in-group/out-group thinking. Compassion-focused therapy demonstrates that expanding circle of care improves both social connection and personal well-being.',
'Mirror neuron systems respond to human suffering regardless of group membership. Research shows that exposure to diverse perspectives reduces amygdala responses to out-group members.',
'Social identity research shows that broader identity categories (human, global citizen) correlate with reduced prejudice, increased cooperation, and greater concern for global issues.'),

('Present Moment Focus',
'Living in the present moment rather than dwelling on the past or worrying about the future. The only time we can act is now.',
'The present moment is all we truly possess. Focus your attention here.',
'Mindfulness research demonstrates multiple benefits of present-moment awareness including reduced rumination, lower anxiety, improved cognitive function, and better emotional regulation.',
'Mindfulness-based CBT combines traditional CBT with present-moment awareness. Studies show this approach is particularly effective for preventing depression relapse and managing chronic pain.',
'fMRI studies show that mindfulness practice increases prefrontal cortex activity (executive function) while reducing amygdala reactivity (emotional reactivity). Regular practice produces structural brain changes.',
'Flow state research by Csikszentmihalyi shows that complete present-moment absorption in activities produces optimal performance and subjective well-being. Attention to the present is trainable and beneficial.');
