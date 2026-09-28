@echo off
cd /d D:\YH\QunXiangTest
set DATABASE_URL=postgresql://qunxiang:change_me_in_production@127.0.0.1:5432/qunxiang
node scripts\pg-server.mjs start >> logs-pg.txt 2>&1
