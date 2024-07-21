INSERT INTO Users (email, password, name, image_path) VALUES
('alice@example.com', 'password1', 'Alice Johnson', 'path/to/alice.jpg'),
('bob@example.com', 'password2', 'Bob Smith', 'path/to/bob.jpg'),
('carol@example.com', 'password3', 'Carol White', 'path/to/carol.jpg'),
('dave@example.com', 'password4', 'Dave Brown', 'path/to/dave.jpg'),
('eve@example.com', 'password5', 'Eve Davis', 'path/to/eve.jpg');

INSERT INTO Workspace (name, user_id) VALUES
('Workspace 1', 1),
('Workspace 2', 1),
('Workspace 3', 2),
('Workspace 4', 3),
('Workspace 5', 4),
('Workspace 6', 5);

INSERT INTO Bubble (top, leftmost, width, height, path, path_depth, workspace_id) VALUES
(100, 200, 50, 50, 'path', 1, 1),
(150, 250, 60, 60, 'path_to', 2, 1),
(200, 300, 70, 70, 'path_to_bubble3.jpg', 3, 2),
(250, 350, 80, 80, 'path_to_bubble4.jpg', 3, 3),
(300, 400, 90, 90, 'path_to_bubble4.jpg_hihi', 4, 4),
(350, 450, 100, 100, 'path_to_bubble4.jpg_byebyebye', 4, 5),
(500,1000, 100, 200, 'path_to_bubble4.jpg_byebyebye_hihihi', 5, 5);

INSERT INTO Curve (red, green, blue, alpha, b_width, b_height, b_top, b_left, path, thickness, bubble_id) VALUES
(255, 0, 0, 255, 50, 50, 100, 200, 'path', 5, 1),
(0, 255, 0, 255, 60, 60, 150, 250, 'path_to', 4, 2),
(0, 0, 255, 255, 70, 70, 200, 300, 'path_to_bubble3.jpg', 3, 3),
(255, 255, 0, 255, 80, 80, 250, 350, 'path_to_bubble4.jpg', 2, 4),
(0, 255, 255, 255, 90, 90, 300, 400, 'path_to_bubble4.jpg_byebyebye', 1, 6),
(255, 0, 255, 255, 100, 100, 350, 450, 'path_to_bubble4.jpg', 5, 4);

INSERT INTO Controls (x, y, is_visible, curve_id) VALUES
(10, 20, 1, 1),
(30, 40, 1, 1),
(50, 60, 0, 2),
(70, 80, 0, 2),
(90, 100, 1, 3),
(110, 120, 1, 3),
(130, 140, 0, 4),
(150, 160, 0, 4),
(170, 180, 1, 5),
(190, 200, 1, 5),
(210, 220, 0, 6),
(230, 240, 0, 6);
