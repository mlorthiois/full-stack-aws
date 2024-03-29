resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "db-subnets-group"
  subnet_ids = aws_subnet.db_subnets.id
}

resource "aws_rds_cluster" "cluster" {
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = "12.7"
  cluster_identifier = "aurora-cluster-main"
  master_username    = var.postgres_username
  master_password    = var.postgres_password

  db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name

  backup_retention_period = 7
}

resource "aws_rds_cluster_instance" "cluster_instances" {
  count = var.counts

  identifier         = "${var.project_name}-${count.index}"
  cluster_identifier = aws_rds_cluster.cluster.id
  instance_class     = "db.t3.medium"
  engine             = aws_rds_cluster.cluster.engine
  engine_version     = aws_rds_cluster.cluster.engine_version

  publicly_accessible = false
}

// Allow access
resource "aws_security_group_rule" "postgresql_fargate_instances_sg" {
  security_group_id = aws_default_security_group.vpc_security_group.id

  type      = "ingress"
  protocol  = "tcp"
  from_port = 5432
  to_port   = 5432

  source_security_group_id = aws_security_group.instance.id
}
