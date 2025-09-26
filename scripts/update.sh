#!/bin/bash

directory="./stt/stt_data/"

files=($(ls "$directory" | grep "^transcribed"))

if [ ${#files[@]} -eq 0 ]; then
    echo "No files starting with 'transcribed' found in directory."
    exit 1
fi

echo "-------------------------------------------------------------------------------------------------------------"
echo "This update should be done once you have updated your transcribed_data.json file to be accurate to the script OR"
echo "you are changing your use case to one of the three prebuilt use cases provided in this asset."
echo "Only files that start with 'transcribed_' can be used to update the utterance, nlu, and radar graph files."
echo "Are you sure you want to run this update?"
echo "-------------------------------------------------------------------------------------------------------------"
echo -e

read -p "Are you sure you want to continue? (Yes/No): " confirm
if [[ $confirm != "yes" && $confirm != "y" ]]; then
    echo "Update cancelled by user."
    exit 1
fi

echo "Transcribed data files in directory:"
for i in "${!files[@]}"; do
    echo "$i. ${files[$i]}"
done

read -p "Enter the number of the file you want to select: " selection

if [[ $selection =~ ^[0-9]+$ ]] && (( selection >= 0 )) && (( selection < ${#files[@]} )); then
    selected_file="${files[$selection]}"
    echo "You selected: $selected_file"
    cd stt && npm run run-update -- "$selected_file"
else
    echo "Invalid selection. Please enter a valid number."
    exit 1
fi
