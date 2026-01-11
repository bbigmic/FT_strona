#!/bin/bash

# Skrypt do naprawy uprawnień dla projektu new-feliz
# Uruchom: sudo ./fix-permissions.sh

PROJECT_DIR="/Users/bigmic/Desktop/apki/new-feliz"
USER_NAME="bigmic"
GROUP_NAME="staff"

echo "Naprawianie uprawnień dla projektu..."
echo "Katalog: $PROJECT_DIR"
echo "Właściciel: $USER_NAME:$GROUP_NAME"
echo ""

# Zmiana właściciela wszystkich plików
echo "1. Zmienianie właściciela plików..."
chown -R "$USER_NAME:$GROUP_NAME" "$PROJECT_DIR"

# Ustawienie uprawnień do odczytu i zapisu dla właściciela
echo "2. Ustawianie uprawnień do zapisu..."
chmod -R u+rwX "$PROJECT_DIR"

# Usunięcie flag immutable (jeśli są)
echo "3. Usuwanie flag immutable..."
chflags -R nouchg "$PROJECT_DIR"

echo ""
echo "✓ Uprawnienia zostały naprawione!"
echo "Teraz możesz zapisywać pliki bez problemów."



