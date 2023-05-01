////////////////////////////////////////////////////////
// VPC
////////////////////////////////////////////////////////
resource "aws_vpc" "vpc" {
  cidr_block                       = "10.16.0.0/16"
  enable_dns_support               = true
  enable_dns_hostnames             = true
  assign_generated_ipv6_cidr_block = true

  tags = {
    "Name" : "custom-vpc"
  }
}

////////////////////////////////////////////////////////
// SUBNETS
////////////////////////////////////////////////////////
data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public_subnets" {
  count = var.counts

  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 4, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name = "public-sn-${count.index}"
  }
}

resource "aws_subnet" "app_subnets" {
  count = var.counts

  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = cidrsubnet(aws_vpc.vpc.cidr_block, 4, var.counts + count.index)

  tags = {
    Name = "app-sn-${count.index}"
  }
}

resource "aws_subnet" "db_subnets" {
  count = var.counts

  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = cidrsubnet(aws_vpc.vpc.cidr_block, 4, (2 * var.counts) + count.index)

  tags = {
    Name = "db-sn-${count.index}"
  }
}

////////////////////////////////////////////////////////
// Internet Gateway with associated route table
////////////////////////////////////////////////////////
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "vpc-igw"
  }
}

resource "aws_route_table" "vpc-rt-web" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "vpc-rt-web"
  }
}

resource "aws_route_table_association" "public-igw" {
  count = var.counts

  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.vpc-rt-web.id
}

////////////////////////////////////////////////////////
// NAT Gateway with route table
////////////////////////////////////////////////////////
resource "aws_eip" "nat_gateway_eip" {
  count = var.counts
  vpc   = true
}

resource "aws_nat_gateway" "vpc_natgw" {
  count = var.counts

  allocation_id = aws_eip.nat_gateway_eip[count.index].id
  subnet_id     = aws_subnet.public_subnets[count.index].id

  tags = {
    Name : "vpc-natgw-${count.index}"
  }

  depends_on = [aws_internet_gateway.igw, aws_eip.nat_gateway_eip]
}

resource "aws_route_table" "vpc_rt_natgw" {
  count = var.counts

  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.vpc_natgw[count.index].id
  }

  tags = {
    Name = "vpc-rt-private-${count.index}"
  }

  depends_on = [aws_nat_gateway.vpc_natgw]
}

resource "aws_route_table_association" "public-to-private" {
  count = var.counts

  subnet_id = concat(
    aws_subnet.app_subnets.*.id,
    aws_subnet.db_subnets.*.id,
  )[count.index]

  route_table_id = aws_route_table.vpc_rt_natgw[count.index % 2].id
}
