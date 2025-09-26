#!/bin/bash

directory="./audio_files/"

files=($(ls "$directory"))
echo "Files in directory:"
for i in "${!files[@]}"; do
    echo "$i. ${files[$i]}"
done

read -p "Enter the number of the file you want to select: " selection

if [[ $selection =~ ^[0-9]+$ ]] && (( selection >= 0 )) && (( selection < ${#files[@]} )); then
    selected_file="${files[$selection]}"
    echo "You selected: $selected_file"

    destination_directory="./public"
    mkdir -p "$destination_directory"
    cp "$directory/$selected_file" "$destination_directory"

    echo -e
    echo "--------------------------------------------------"
    echo "File copied to $destination_directory/$selected_file"
    echo "--------------------------------------------------"
    echo -e

    env_file=".env.local"
    audio_file_line="NEXT_PUBLIC_AUDIO_FILE='$selected_file'"
    timestamp=$(date +"%Y-%m-%d %T")

    sed -i '' "/^# Audio file env changed /d" "$env_file"
    sed -i '' "/^NEXT_PUBLIC_AUDIO_FILE=/d" "$env_file"

    echo "# Audio file env changed $timestamp" >> "$env_file"
    echo "$audio_file_line" >> "$env_file"

    echo -e 
    echo "--------------------------------------------------"
    echo "Updated $env_file with:"
    echo "# Audio file env changed $timestamp"
    echo "$audio_file_line"
    echo "--------------------------------------------------" 
    echo -e 

    cd stt && npm run run-stt -- "$selected_file"
else
    echo "Invalid selection. Please enter a valid number."
    exit 1
fi
