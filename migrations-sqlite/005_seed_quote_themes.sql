-- Associate quotes with themes
-- Marcus Aurelius quotes
INSERT INTO quote_themes (quote_id, theme_id) VALUES
-- "You have power over your mind" - Dichotomy of Control
(1, 1),
-- "The happiness of your life" - Present Moment, Virtue
(2, 3), (2, 7),
-- "Waste no more time arguing" - Virtue, Present Moment
(3, 3), (3, 7),
-- "If it is not right" - Virtue
(4, 3),
-- "The impediment to action" - Amor Fati
(5, 4),
-- "When you arise in the morning" - Present Moment, Memento Mori
(6, 7), (6, 5),
-- "Very little is needed" - Dichotomy of Control, Virtue
(7, 1), (7, 3),
-- "It is not death that a man should fear" - Memento Mori
(8, 5),
-- "The best revenge" - Virtue
(9, 3),
-- "Look well into thyself" - Dichotomy of Control
(10, 1),
-- "Accept the things to which fate binds you" - Amor Fati, Cosmopolitanism
(11, 4), (11, 6),
-- "Everything we hear is an opinion" - Dichotomy of Control, Present Moment
(12, 1), (12, 7),
-- "Confine yourself to the present" - Present Moment
(13, 7),
-- "The universe is change" - Amor Fati, Dichotomy of Control
(14, 4), (14, 1),
-- "Do not act as if you had ten thousand years" - Memento Mori, Present Moment
(15, 5), (15, 7),
-- "He who lives in harmony with himself" - Virtue, Cosmopolitanism
(16, 3), (16, 6),
-- "The first rule is to keep an untroubled spirit" - Dichotomy of Control
(17, 1),
-- "It never ceases to amaze me" - Dichotomy of Control
(18, 1),
-- "Begin each day by telling yourself" - Negative Visualization
(19, 2),
-- "Your days are numbered" - Memento Mori, Present Moment
(20, 5), (20, 7),
-- "To live each day as though one''s last" - Memento Mori, Present Moment, Virtue
(21, 5), (21, 7), (21, 3),
-- "How much more grievous" - Dichotomy of Control
(22, 1),
-- "The soul becomes dyed" - Dichotomy of Control, Virtue
(23, 1), (23, 3),
-- "Be tolerant with others" - Virtue, Cosmopolitanism
(24, 3), (24, 6),
-- "The object of life" - Virtue, Dichotomy of Control
(25, 3), (25, 1);

-- Seneca quotes
INSERT INTO quote_themes (quote_id, theme_id) VALUES
-- "We suffer more often in imagination" - Negative Visualization, Dichotomy of Control
(26, 2), (26, 1),
-- "It is not that we have a short time" - Memento Mori, Present Moment
(27, 5), (27, 7),
-- "Luck is what happens when preparation" - Dichotomy of Control
(28, 1),
-- "He who is brave is free" - Virtue, Dichotomy of Control
(29, 3), (29, 1),
-- "Difficulties strengthen the mind" - Amor Fati
(30, 4),
-- "Begin at once to live" - Present Moment, Memento Mori
(31, 7), (31, 5),
-- "True happiness is to enjoy the present" - Present Moment
(32, 7),
-- "As is a tale, so is life" - Memento Mori, Virtue
(33, 5), (33, 3),
-- "The whole future lies in uncertainty" - Present Moment, Dichotomy of Control
(34, 7), (34, 1),
-- "No man was ever wise by chance" - Virtue
(35, 3),
-- "If one does not know to which port" - Virtue
(36, 3),
-- "It is the power of the mind" - Dichotomy of Control
(37, 1),
-- "Wealth is the slave of a wise man" - Virtue
(38, 3),
-- "A gem cannot be polished without friction" - Amor Fati
(39, 4),
-- "We are more often frightened than hurt" - Negative Visualization
(40, 2),
-- "Wherever there is a human being" - Cosmopolitanism, Virtue
(41, 6), (41, 3),
-- "The mind that is anxious" - Present Moment, Negative Visualization
(42, 7), (42, 2),
-- "Associate with people who are likely" - Virtue
(43, 3),
-- "Life is like a play" - Virtue, Memento Mori
(44, 3), (44, 5),
-- "He suffers more than necessary" - Negative Visualization, Present Moment
(45, 2), (45, 7),
-- "The greatest obstacle to living" - Present Moment
(46, 7),
-- "You act like mortals in all that you fear" - Memento Mori, Dichotomy of Control
(47, 5), (47, 1),
-- "A great pilot can sail" - Amor Fati, Virtue
(48, 4), (48, 3),
-- "Nothing, to my way of thinking" - Virtue, Dichotomy of Control
(49, 3), (49, 1),
-- "You live as if you were destined" - Memento Mori, Present Moment
(50, 5), (50, 7);

-- Epictetus quotes
INSERT INTO quote_themes (quote_id, theme_id) VALUES
-- "It''s not what happens to you" - Dichotomy of Control
(51, 1),
-- "There is only one way to happiness" - Dichotomy of Control
(52, 1),
-- "First say to yourself what you would be" - Virtue
(53, 3),
-- "He is a wise man who does not grieve" - Dichotomy of Control, Present Moment
(54, 1), (54, 7),
-- "Wealth consists not in having great possessions" - Virtue, Dichotomy of Control
(55, 3), (55, 1),
-- "If you want to improve" - Virtue
(56, 3),
-- "Don''t explain your philosophy" - Virtue
(57, 3),
-- "No man is free who is not master" - Dichotomy of Control, Virtue
(58, 1), (58, 3),
-- "Any person capable of angering you" - Dichotomy of Control
(59, 1),
-- "Make the best use of what is in your power" - Dichotomy of Control
(60, 1),
-- "It is impossible for a man to learn" - Virtue
(61, 3),
-- "People are not disturbed by things" - Dichotomy of Control
(62, 1),
-- "Demand not that events should happen" - Amor Fati, Dichotomy of Control
(63, 4), (63, 1),
-- "The key is to keep company" - Virtue
(64, 3),
-- "Whoever then wishes to be free" - Dichotomy of Control
(65, 1),
-- "You are a little soul carrying" - Memento Mori, Virtue
(66, 5), (66, 3),
-- "When you are offended" - Virtue, Cosmopolitanism
(67, 3), (67, 6),
-- "Know, first, who you are" - Virtue
(68, 3),
-- "Circumstances don''t make the man" - Amor Fati, Virtue
(69, 4), (69, 3),
-- "Freedom is the only worthy goal" - Dichotomy of Control
(70, 1),
-- "We have two ears and one mouth" - Virtue
(71, 3),
-- "To accuse others for one''s own misfortunes" - Dichotomy of Control, Virtue
(72, 1), (72, 3),
-- "Attach yourself to what is spiritually superior" - Virtue
(73, 3),
-- "Only the educated are free" - Virtue
(74, 3),
-- "If anyone tells you that a certain person" - Virtue, Dichotomy of Control
(75, 3), (75, 1);
