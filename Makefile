run-backend:
	@echo "\033[1;32mStarting the back-end server...\033[0m"
	@cd backend && python manage.py runserver

run-frontend:
	@echo "\033[1;34mStarting the front-end server...\033[0m"
	@cd front-end && npm run dev

setup-backend:
	@echo "\033[1;33mSetting up backend environment...\033[0m"
	@python3 -m venv backend/venv
	@source backend/venv/bin/activate && pip install -r backend/requirements.txt

set-run-backend: setup-backend run-backend

.PHONY: dev setup-backend
