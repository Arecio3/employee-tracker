USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Web Development"), ("Sales"), ("Legal"), ("Human Resources"), ("Management"), ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior", 200000, 1),("Junior", 60000, 1),("Lawyer", 150000, 3),("Graphic Design", 100000, 1),("Accountant", 85000, 6),("Receptionist", 30000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Arecio","Canton",1, NULL),("Annie", "Mascarello",2, NULL),("Patrick","Moore",3, NULL),("Adam","Alcantara",4, NULL),("John","Travolta",2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Richar","Morgado",3, 1),("Yanet", "Alvarez",2, 2),("Emily","Morgado",2, 3),("Melany","Morgado",4, 4),("Rick","Sanchez",2, 5);
